import { config } from '@/config/config';
import {io} from 'socket.io-client';
import { Socket } from '@/types/socket-io-client';
import {createId} from "@paralleldrive/cuid2";

export class SocketIoService {
  io: Socket
  id = createId()

  constructor(roomId: string, userId: string) {
    this.io = io(config.server.baseUrl, {
      query: {
        userId,
        roomId,
        peerId: this.id
      },
      transports: ["websocket"],
    })
  }

  cleanUp() {
    this.io.disconnect()
    this.io.close()
  }
}
