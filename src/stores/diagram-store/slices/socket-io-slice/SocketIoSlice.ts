import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store";
import { SocketIoService } from "@/services";
import { BROADCAST, SOCKET } from "@/namespaces";
import { REACTFLOW } from "@/namespaces/broadcast/reactflow";
import { ReactflowUtils } from "@/utility/ReactflowUtils";
import { NODE } from "@/namespaces/broadcast/node";
import { EntityUtils } from "@/utility/EntityUtils";
import { notifications } from "@mantine/notifications";
import { applyNodeChanges } from "@xyflow/react";

interface SocketIoState {
  socket: SocketIoService;
  isConnected: boolean;
  subscribers: string[];
  subscribedTo: string | null;
}

interface SocketIoAction {
  applyDataChanges: (data: BROADCAST.DATA[]) => void;
  subscribe: (id: string) => void;
  unsubscribe: () => void;
}

export type SocketIoSlice = SocketIoState & SocketIoAction;

export const socketIoSlice: (
  roomId: string,
  userId: string,
) => StateCreator<DiagramStore, [], [], SocketIoSlice> =
  (roomId, userId) => (set, get, api) => {
    const socket = new SocketIoService(roomId, userId);

    socket.io.on("connect", () => {
      console.debug("Connected to socket.io");
      set({
        isConnected: true,
      });
    });

    socket.io.on("disconnect", (reason) => {
      set((state) => {
        const updatedState: Partial<DiagramStore> = {
          isConnected: false,
        };
        switch (reason) {
          case "io client disconnect":
            console.log("io client disconnect");
            break;
          case "io server disconnect":
            console.log("io server disconnect");
            break;
          case "parse error":
            console.log("parse error");
            break;
          case "ping timeout":
            console.log("ping timeout");
            break;
          case "transport close":
            console.log("transport close");
            updatedState.clients = [];
            break;
          case "transport error":
            console.log("transport error");
            break;
        }

        return updatedState;
      });
    });

    socket.io.on(SOCKET.USER.JOIN, ({ userId, id, color }) => {
      set((state) => ({
        clients: [
          ...state.clients,
          {
            id,
            userId,
            cursor: null,
            color,
          },
        ],
      }));
    });

    socket.io.on(SOCKET.USER.LEFT, ({ id }) => {
      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
      }));
    });

    socket.io.on(SOCKET.DATA.INITIAL_DATA, (data) => {
      set({
        ...(data as any),
        synced: true,
      });
    });


    socket.io.on(SOCKET.USER.SUBSCRIBED, (id) => {
      set((state) => {
        socket.io.emit(SOCKET.USER.VIEWPORT_CHANGE, state.reactflow.getViewport())
        return {
          subscribers: [...state.subscribers, id],
        }
      });
    });

    socket.io.on(SOCKET.USER.UNSUBSCRIBED, (id) => {
      set((state) => ({
        subscribers: state.subscribers.filter(
          (subscriber) => subscriber !== id,
        ),
      }));
    });

    socket.io.on(SOCKET.USER.VIEWPORT_CHANGE, (viewport) => {
      api.getState().reactflow.setViewport(viewport);
    });

    socket.io.on(SOCKET.USER.CURSOR_CHANGE, (data) => {
      set(state => ({
        clients: state.clients.map(client => {
          if (client.id !== data.id) {
            return client
          }

          return {
            ...client,
            cursor: data.cursor
          }
        })
      }))
    })

    socket.io.on(SOCKET.USER.NODE_DRAG, (changes) => {
      set(state => ({
        nodes: applyNodeChanges(changes, state.nodes)
      }))
    })

    const applyDataChanges = (data: BROADCAST.DATA[]) => {
      set((state) => {
        const updatedState: Partial<DiagramStore> = {};
        data.forEach((change) => {
          const { type, value } = change;
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
              EntityUtils.updateConfig(updatedState, state, value);
              break;
            case NODE.ENTITY.TYPE.NAME_UPDATE:
              EntityUtils.updateName(updatedState, state, change);
              break;
            case NODE.ENTITY.TYPE.COLOR_UPDATE:
              EntityUtils.updateColor(updatedState, state, change);
              break;
            case NODE.ENTITY.TYPE.COLUMN_ADD:
              EntityUtils.addColumn(updatedState, state, change);
              break;
            case NODE.ENTITY.TYPE.COLUMN_UPDATE:
              EntityUtils.updateColumn(updatedState, state, change);
              break;
            case NODE.ENTITY.TYPE.COLUMN_DELETE:
              EntityUtils.deleteColumn(updatedState, state, change);
              break;
            case NODE.ENTITY.TYPE.COLUMN_ORDER_UPDATE:
              EntityUtils.updateColumnOrder(updatedState, state, change);
              break;
            default: {
              console.log(type, data);
            }
          }
        });

        return updatedState;
      });
    };

    socket.io.on(SOCKET.DATA.UPDATE_DATA, applyDataChanges);

    const unsubscribe = () =>
      new Promise((resolve, reject) => {
        const { subscribedTo } = api.getState();

        if (!subscribedTo) {
          resolve("There is no subscription")
        } else {
          socket.io.emit(SOCKET.USER.UNSUBSCRIBE, subscribedTo, (status) => {
            switch (status) {
              case SOCKET.STATUS.OK:
                api.setState({ subscribedTo: null });
                resolve("Succesfully unsubscribed");
                break;
              case SOCKET.STATUS.FAILED:
                reject("Failed to unsubscribe")
                break
            }
          });
        }
      });

    return {
      subscribers: [],
      subscribedTo: null,
      socket,
      isConnected: false,
      applyDataChanges,
      subscribe: (id) => {
        unsubscribe().then(() => {
          socket.io.emit(SOCKET.USER.SUBSCRIBE, id, (status) => {
            switch (status) {
              case SOCKET.STATUS.OK:
                set({ subscribedTo: id });
                break
              case SOCKET.STATUS.FAILED:
                notifications.show({
                  title: "Failed",
                  message: `Subscribe to ${id}`
                })
            }
          });
        })
      },
      unsubscribe,
    };
  };
