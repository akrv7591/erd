import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {SocketIoService} from "@/services";
import {BROADCAST, SOCKET} from "@/namespaces";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";
import {ReactflowUtils} from "@/utility/ReactflowUtils";
import {NODE} from "@/namespaces/broadcast/node";
import {EntityUtils} from "@/utility/EntityUtils";
import {CLIENT} from "@/namespaces/broadcast/client";
import {ClientUtils} from "@/utility/ClientUtils";
import randomColor from "randomcolor";

interface SocketIoState {
  socket: SocketIoService
  isConnected: boolean
}

interface SocketIoAction {
  applyDataChanges: (data: BROADCAST.DATA[]) => void
}

export type SocketIoSlice = SocketIoState & SocketIoAction

export const socketIoSlice: (roomId: string, userId: string) => StateCreator<DiagramStore, [], [], SocketIoSlice> = (roomId, userId)  => (set, get, api) => {
  const socket = new SocketIoService(roomId, userId)

  socket.io.on("connect", () => {
    console.debug("Connected to socket.io")
    set({
      isConnected: true
    })
  })

  socket.io.on("disconnect", (reason) => {
    set(state => {
      const updatedState: Partial<DiagramStore> = {
        isConnected: false
      }
      switch(reason) {
        case "io client disconnect":
          console.log("io client disconnect")
          break
        case "io server disconnect":
          console.log("io server disconnect")
          break
        case "parse error":
          console.log("parse error")
          break
        case "ping timeout":
          console.log("ping timeout")
          break
        case "transport close":
          console.log("transport close")
          updatedState.clients = []
          break
        case "transport error":
          console.log("transport error")
          break

      }

      return updatedState
    })
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

  const applyDataChanges = (data: BROADCAST.DATA[]) => {
    set((state) => {
      const updatedState: Partial<DiagramStore> = {};
      data.forEach((change) => {
        const {type, value} = change
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
            EntityUtils.updateName(updatedState, state, change)
            break;
          case NODE.ENTITY.TYPE.COLOR_UPDATE:
            EntityUtils.updateColor(updatedState, state, change)
            break;
          case NODE.ENTITY.TYPE.COLUMN_ADD:
            EntityUtils.addColumn(updatedState, state, change)
            break;
          case NODE.ENTITY.TYPE.COLUMN_UPDATE:
            EntityUtils.updateColumn(updatedState, state, change)
            break;
          case NODE.ENTITY.TYPE.COLUMN_DELETE:
            EntityUtils.deleteColumn(updatedState, state, change)
            break;
          case NODE.ENTITY.TYPE.COLUMN_ORDER_UPDATE:
            EntityUtils.updateColumnOrder(updatedState, state, change)
            break

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
    })
  }

  socket.io.on(SOCKET.DATA.UPDATE_DATA, applyDataChanges)

  return {
    socket,
    isConnected: false,
    applyDataChanges
  }
}
