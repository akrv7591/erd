import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {SocketIoService} from "@/services";
import {SOCKET} from "@/namespaces";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";
import {ReactflowUtils} from "@/utility/ReactflowUtils";
import {NODE} from "@/namespaces/broadcast/node";
import {EntityUtils} from "@/utility/EntityUtils";
import {CLIENT} from "@/namespaces/broadcast/client";
import {ClientUtils} from "@/utility/ClientUtils";
import randomColor from "randomcolor";

interface SocketIoState {
  socket: SocketIoService
}

interface SocketIoAction {}

export type SocketIoSlice = SocketIoState & SocketIoAction

export const socketIoSlice: (roomId: string, userId: string, peerId: string) => StateCreator<DiagramStore, [], [], SocketIoSlice> = (roomId, userId, peerId)  => (set, get, api) => {
  const socket = new SocketIoService(roomId, userId)

  socket.io.on("connect", () => {
    console.debug("Connected to socket.io")
  })

  socket.io.on(SOCKET.USER.JOIN, ({userId, id}) => {
    set(state => ({
      clients: [...state.clients, {
        id,
        userId,
        cursor: null,
        color: randomColor()
      }]
    }))
  })

  socket.io.on(SOCKET.USER.LEFT, ({id}) => {
    set(state => ({
      clients: state.clients.filter(client => client.id !== id)
    }))
  })

  socket.io.on(SOCKET.DATA.INITIAL_DATA, (data) => {
    set({
      ...data as any,
      synced: true
    })
  })


  socket.io.on(SOCKET.DATA.UPDATE_DATA, (data) => {
    api.setState((state) => {
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
  })

  return {
    socket
  }
}
