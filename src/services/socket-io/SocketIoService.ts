import { config } from '@/config/config';
import {io} from 'socket.io-client';
import { Socket } from '@/types/socket-io-client';

export class SocketIoService {
  io: Socket

  constructor(roomId: string, userId: string, peerId: string) {
    this.io = io(config.server.baseUrl, {
      query: {
        userId,
        roomId,
        peerId
      },
      transports: ["websocket"],
    })
  }

  cleanUp() {
    this.io.disconnect()
    this.io.close()
  }
}
