import { Socket as SocketIoType } from "socket.io-client";
import {BROADCAST, SOCKET} from "@/namespaces";
import {Erd} from "@/types/data/db-model-interfaces";

type WithAcknowledgement<T> = (
  data: T,
  callback?: (status: SOCKET.STATUS) => void,
) => void;

interface SocketData {
  roomId: string;
  id: string;
  userId: string;
  socketId: string;
}

interface ListenerEventMaps {
  [SOCKET.USER.JOIN]: WithAcknowledgement<SocketData>;
  [SOCKET.USER.LEFT]: WithAcknowledgement<SocketData>;
  [SOCKET.DATA.INITIAL_DATA]: WithAcknowledgement<Erd['data']>;
  [SOCKET.DATA.INITIAL_DATA_NOT_FOUND]: WithAcknowledgement<null>;
  [SOCKET.DATA.UPDATE_DATA]: WithAcknowledgement<BROADCAST.DATA[]>;
}
interface EmitEventMaps {
  [SOCKET.DATA.UPDATE_DATA]: WithAcknowledgement<BROADCAST.DATA[]>;
}

export type Socket = SocketIoType<ListenerEventMaps, EmitEventMaps>;
