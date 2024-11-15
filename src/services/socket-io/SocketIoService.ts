import { config } from '@/config/config';
import {io} from 'socket.io-client';
import { Socket } from '@/types/socket-io-client';
import { BROADCAST, SOCKET } from '@/namespaces';
import { createId } from '@paralleldrive/cuid2';

export class SocketIoService {
  io: Socket
  roomId: string
  id = createId()

  constructor(roomId: string, userId: string) {
    this.roomId = roomId
    this.io = io(config.server.baseUrl, {
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
    this.io.emit(SOCKET.DATA.UPDATE_DATA, JSON.stringify(data))
  }
}
