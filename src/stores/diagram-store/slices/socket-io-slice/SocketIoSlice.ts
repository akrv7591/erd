import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {SocketIoService} from "@/services";
import {SOCKET} from "@/namespaces";

interface SocketIoState {
  socket: SocketIoService
}

interface SocketIoAction {}

export type SocketIoSlice = SocketIoState & SocketIoAction

export const socketIoSlice: (roomId: string, userId: string, peerId: string) => StateCreator<DiagramStore, [], [], SocketIoSlice> = (roomId, userId, peerId)  => (set, get, api) => {
  const socket = new SocketIoService(roomId, userId, peerId)

  socket.io.on("connect", () => {
    console.debug("Connected to socket.io")
  })

  socket.io.on(SOCKET.USER.JOIN, ({userId, peerId}) => {
    api.getState().webrtc.addPeer(peerId, userId)
  })

  socket.io.on(SOCKET.USER.LEFT, ({peerId}) => {
    api.getState().webrtc.removeConnection(peerId)
  })

  socket.io.on(SOCKET.DATA.INITIAL_DATA, (data) => {
    set({
      ...data as any,
      synced: true
    })
  })

  return {
    socket
  }
}
