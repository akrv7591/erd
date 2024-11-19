import { config } from '@/config/config';
import {io} from 'socket.io-client';
import { Socket } from '@/types/socket-io-client';
import { BROADCAST, SOCKET } from '@/namespaces';
import {ShortId} from "@/utility/ShortId";

export class SocketIoService {
  io: Socket
  roomId: string
  id = ShortId.create()

  constructor(roomId: string, userId: string) {
    this.roomId = roomId
    this.io = io(config.server.baseUrl, {
      transports: ["websocket"],
      secure: true,
      query: {
        userId,
        roomId,
        id: this.id
      },
    })
  }

  cleanUp() {
    this.io.disconnect()
    this.io.close()
  }

  broadcastData = (data: BROADCAST.DATA[]) => {
    this.io.emit(SOCKET.DATA.UPDATE_DATA, data)
  }
}
