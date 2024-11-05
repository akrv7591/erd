import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {SocketIoService} from "@/services";
import {SOCKET} from "@/namespaces";

interface SocketIoState {
  socket: SocketIoService
}

interface SocketIoAction {}

export type SocketIoSlice = SocketIoState & SocketIoAction

export const socketIoSlice: (roomId: string) => StateCreator<DiagramStore, [], [], SocketIoSlice> = (roomId: string)  => (set, get) => {
  const socket = new SocketIoService(roomId)

  socket.io.on("connect", () => {
    console.debug("Connected to socket.io")
    get().initWebrtc(socket.id)
  })

  socket.io.on(SOCKET.USER.JOIN, ({userId, peerId}) => {
    get().webrtc.addPeer(peerId, userId)
  })

  socket.io.on(SOCKET.USER.LEFT, ({peerId}) => {
    get().webrtc.removeConnection(peerId)
  })

  socket.io.on(SOCKET.DATA.INITIAL_DATA, (data) => {
    set({
      ...data as any,
    })
  })

  return {
    socket
  }
}
