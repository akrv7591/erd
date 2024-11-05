import { config } from '@/config/config.ts';
import { useLogToAuthStore } from '@/stores/useLogToAuthStore.ts';
import {io} from 'socket.io-client';
import { Socket } from '@/types/socket-io-client.ts';
import {createId} from "@paralleldrive/cuid2";

export class SocketIoService {
  io: Socket
  id = createId()

  constructor(roomId: string) {
    this.io = io(config.server.baseUrl, {
      auth: {
        token: useLogToAuthStore.getState().accessToken
      },
      query: {
        userId: useLogToAuthStore.getState().user?.sub,
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
