import {PlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {ReactFlowInstance} from "@xyflow/react";
import {Socket} from "socket.io-client";

export type ServiceArgs = {
  store: PlaygroundStore
  reactFlow: ReactFlowInstance
  socket: Socket
}
