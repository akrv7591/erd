import {DiagramStore} from "@/stores/diagram-store";
import {createId} from "@paralleldrive/cuid2";
import {applyEdgeChanges, applyNodeChanges,} from "@xyflow/react";
import {DataConnection, Peer} from "peerjs";
import {StoreApi} from "zustand";
import {NodeType, DataBroadcast} from "@/types/diagram"
import randomColor from "randomcolor";
import {BROADCAST, SOCKET} from "@/namespaces";
import {config} from "@/config/config";

export class WebrtcService {
  id: string = createId();
  peer: Peer;
  store: StoreApi<DiagramStore>;
  connections: Record<string, DataConnection> = {};

  constructor(id: string, store: StoreApi<DiagramStore>) {
    this.store = store;
    this.id = id
    this.peer = new Peer(this.id, {
      host: config.peerjsServer,
      secure: true,
      debug: 1
    });
    this.initListeners();
  }

  cleanUp = () => {
    this.peer.destroy();
  };

  broadcastData = (data: DataBroadcast[]) => {
    const serverBroadcastData = data.filter(obj => obj.server);

    if (serverBroadcastData.length > 0) {
      this.store.getState().socket.io.emit(SOCKET.DATA.UPDATE_DATA, data)
    }

    Object.values(this.connections).forEach((connection) => {
      if (connection.open) {
        connection.send(data);
      } else {
        console.warn(connection.peer + " is closed");
      }
    });
  };

  handleDataFromPeers = (data: DataBroadcast[]) => {
    this.store.setState((state) => {
      const updatedState: Partial<DiagramStore> = {};

      data.forEach(({type, value}) => {
        switch (type) {
          case BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE:
            updatedState.nodes = applyNodeChanges(value, state.nodes);
            break;

          case BROADCAST.DATA.TYPE.NODE_DATA_UPDATE:
            if (!updatedState.nodes) {
              updatedState.nodes = state.nodes;
            }

            updatedState.nodes = updatedState.nodes.map((node) => {
              if (node.id !== value.id) {
                return node;
              }

              return {
                ...node,
                data: value.data,
              } as NodeType;
            });
            break;

          case BROADCAST.DATA.TYPE.CLIENT_CURSOR_CHANGE:
            updatedState.clients = state.clients.map((client) => {
              if (client.peerId !== value.peerId) {
                return client;
              }

              return {
                ...client,
                cursor: value.cursor,
              };
            });
            break;

          case BROADCAST.DATA.TYPE.REACTFLOW_EDGE_CHANGE:
            updatedState.edges = applyEdgeChanges(value, state.edges);
            break;
          case BROADCAST.DATA.TYPE.ENTITY_CONFIG_CHANGE:
            const userConfig = state.configs.find(config => config.userId === value.userId)

            if (!userConfig) {
              updatedState.configs = [...state.configs, value]
            } else {
              updatedState.configs = state.configs.map(config => {
                if (config.userId !== userConfig.userId) {
                  return config
                }

                return value
              })
            }

            break
          default: {
            console.log(data)
          }
        }
      });

      return updatedState;
    });
  };

  addConnection = (connection: DataConnection) => {

    if (this.connections[connection.peer]) {
      if (!this.connections[connection.peer].open) {
        this.connections[connection.peer].close();
        this.connections[connection.peer] = connection;
      }
    } else {
      this.connections[connection.peer] = connection;
    }

    this.store.setState(state => ({
      clients: [...state.clients, {
        peerId: connection.peer,
        userId: connection.metadata.userId,
        cursor: null,
        color: randomColor()
      }]
    }))
  };

  removeConnection = (id: string) => {
    console.log("connection closed", id)
    if (this.connections[id]) {
      // this.connections[id].close();
      delete this.connections[id];
      this.store.setState(state => ({
        clients: state.clients.filter(client => client.peerId !== id)
      }))
    }
  };

  addPeer = (peerId: string, userId: string) => {
    const connection = this.peer.connect(peerId, {
      reliable: true,
      metadata: {
        userId: userId,
      }
    });

    this.initConnectionListeners(connection);
  };

  initListeners = () => {
    this.peer.on("connection", this.initConnectionListeners);
  };

  initConnectionListeners = (connection: DataConnection) => {
    connection
      .on("open", () => this.addConnection(connection))
      .on("data", (data: any) => this.handleDataFromPeers(data))
      .on("close", () => this.removeConnection(connection.peer))
      .on("error", (e) => console.error(e))
  };
}
