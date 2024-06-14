import {PlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {ReactFlowInstance} from "@xyflow/react";
import {MultiplayerSocket} from "@/services/multiplayer/type";

export type ServiceArgs = {
  store: PlaygroundStore
  reactFlow: ReactFlowInstance
  socket: MultiplayerSocket
}
