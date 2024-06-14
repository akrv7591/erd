import {workerService} from "@/services/multiplayer/worker-service.ts";
import {playerService} from "@/services/multiplayer/player-service.ts";
import {columnService} from "@/services/multiplayer/column-service.ts";
import {memoService} from "@/services/multiplayer/memo-service.ts";
import {relationService} from "@/services/multiplayer/relation-service.ts";
import {entityService} from "@/services/multiplayer/entity-service.ts";
import {erdService} from "@/services/multiplayer/erd-service.ts";
import {nodeService} from "@/services/multiplayer/node-service.ts";

export const multiplayerServices = [
  workerService,
  playerService,
  columnService,
  memoService,
  relationService,
  entityService,
  erdService,
  nodeService,
]
