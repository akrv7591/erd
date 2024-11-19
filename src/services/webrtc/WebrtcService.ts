import {DiagramStore} from "@/stores/diagram-store";
import {DataConnection, Peer} from "peerjs";
import {StoreApi} from "zustand";
import randomColor from "randomcolor";
import {BROADCAST} from "@/namespaces";
import {config} from "@/config/config";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";
import {NODE} from "@/namespaces/broadcast/node";
import {CLIENT} from "@/namespaces/broadcast/client";
import {EntityUtils} from "@/utility/EntityUtils";
import {ClientUtils} from "@/utility/ClientUtils";
import {ReactflowUtils} from "@/utility/ReactflowUtils";
import {ShortId} from "@/utility/ShortId";

export class WebrtcService {
  id: string = ShortId.create();
  peer: Peer;
  store: StoreApi<DiagramStore>;
  connections: Record<string, DataConnection> = {};

  constructor(id: string, store: StoreApi<DiagramStore>) {
    this.store = store;
    this.id = id
    this.peer = new Peer(this.id, {
      host: config.peerjs.server,
      secure: true,
      debug: 1,
      config: {
        iceServers: [{
          "urls": "stun:freestun.net:3478"
        },
          {
            "urls": "turn:freestun.net:3478",
            "username": "free",
            "credential": "free"
          }
        ]
      }
    });
    this.initListeners();
  }

  cleanUp = () => {
    this.peer.destroy();
  };

  broadcastData = (data: BROADCAST.DATA[]) => {
    // const serverBroadcastData = data.filter(obj => obj.server);

    // if (serverBroadcastData.length > 0) {
      // this.store.getState().socket.io.emit(SOCKET.DATA.UPDATE_DATA, JSON.stringify(data))
    // }

    // Object.values(this.connections).forEach((connection) => {
    //   if (connection.open) {
    //     connection.send(data);
    //   } else {
    //     console.warn(connection.peer + " is closed");
    //   }
    // });
  };

  handleDataFromPeers = (data: BROADCAST.DATA[]) => {
    this.store.setState((state) => {
      const updatedState: Partial<DiagramStore> = {};

      data.forEach(({type, value}) => {
        switch (type) {
          // Reactflow
          case REACTFLOW.TYPE.NODE_CHANGE:
            ReactflowUtils.updateNodes(updatedState, state, value);
            break;
          case REACTFLOW.TYPE.EDGE_CHANGE:
            ReactflowUtils.updateEdges(updatedState, state, value);
            break;

          // Entity
          case NODE.ENTITY.TYPE.CONFIG_UPDATE:
            EntityUtils.updateConfig(updatedState, state, value)
            break;
          case NODE.ENTITY.TYPE.NAME_UPDATE:
            EntityUtils.updateName(updatedState, state, value)
            break;
          case NODE.ENTITY.TYPE.COLOR_UPDATE:
            EntityUtils.updateColor(updatedState, state, value)
            break;
          case NODE.ENTITY.TYPE.COLUMN_ADD:
            EntityUtils.addColumn(updatedState, state, value)
            break;
          case NODE.ENTITY.TYPE.COLUMN_UPDATE:
            EntityUtils.updateColumn(updatedState, state, value)
            break;
          case NODE.ENTITY.TYPE.COLUMN_DELETE:
            EntityUtils.deleteColumn(updatedState, state, value)
            break;

          // Client
          case CLIENT.CURSOR.TYPE.CHANGE:
            ClientUtils.updateCursor(updatedState, state, value)
            break;
          default: {
            console.log(type, data)
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
        id: connection.peer,
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
        clients: state.clients.filter(client => client.id !== id)
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
