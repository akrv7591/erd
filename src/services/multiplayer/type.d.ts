import {Socket} from "socket.io-client";
import {
  CallbackDataStatus,
  ColumnEnum,
  EntityEnum,
  ErdEnum,
  MemoEnum, NodeEnum,
  PlayerEnum, RelationEnum,
  WorkerEnum
} from "@/enums/playground.ts";
import type {Viewport} from "@xyflow/react";
import type {ServiceArgs} from "@/services/multiplayer/multiplayer";
import {ICColumn, IColumn, ICRelation, IEntity, IErd} from "@/types/data/db-model-interfaces";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import { EntityNodeColumn } from "@/types/entity-node";

export type MousePosition = {
  x: number
  y: number
}

export type NodeData = {
  [NODE_TYPES.MEMO]: {
    content: string,
    color: string
  },
  [NODE_TYPES.ENTITY]: {
    name: string,
    color: string,
    columns: IColumn[]
  }
}

export type NodeType<T extends NODE_TYPES> = {
  id: string,
  type: NODE_TYPES[T]
  position: {
    x: number,
    y: number
  },
  data: NodeData[T]
}

export type SocketCallback = (status: CallbackDataStatus) => void
export type SocketDataHandler<T> = (data: T, callback: SocketCallback) => void

// Worker - listener and emmiter types
type WorkerJoinListenerData = { id: string }
type WorkerJoinEmmitData = WorkerJoinListenerData

type WorkerLeaveListenerData = { id: string }
type WorkerLeaveEmmitData = WorkerLeaveListenerData

type WorkerDataListenerData = any
type WorkerDataEmmitData = WorkerDataListenerData


// Player service - listener and emmiter types
type PlayerSubscribeListenerData     = { playerId: string }
type PlayerSubscribeEmmitData        = PlayerSubscribeListenerData

type PlayerUnSubscribeListenerData   = { playerId: string }
type PlayerUnSubscribeEmmitData      = PlayerUnSubscribeListenerData

type PlayerViewportListenerData      = { playerId: string, viewpoint: Viewport | null }
type PlayerViewpointEmmitData        = PlayerViewportListenerData

type PlayerMouseChangeListenerData   = { playerId: string, cursorPosition: MousePosition | null }
type PlayerMouseChangeEmmitData      = PlayerMouseChangeListenerData


// Column service - listener and emmiter types
type ColumnAddListenerData           = { column: ICColumn }
type ColumnAddEmmitData              = { column: IColumn }

type ColumnPatchListenerData<K,V>    = { entityId: string, columnId: string, key: K, value: V }
type ColumnPatchEmitData             = ColumnPatchListenerData

type ColumnDeleteListenerData        = { entityId: string, columnId: string[] }
type ColumnDeleteEmitData            = ColumnDeleteListenerData

// Memo service - listener and emmiter types

type MemoAddListenerData             = { memo: NodeType<NODE_TYPES.MEMO> }
type MemoAddEmmitData                = { node: NodeType<NODE_TYPES.MEMO> }

type MemoPatchListenerData           = { memoId: string, key: string, value: any }
type MemoPatchEmmitData              = MemoPatchListenerData

type MemoDeleteListenerData          = { memoId: string[] }
// type MemoDeleteEmmitData             = MemoDeleteListenerData


// Entity service - listener and emmiter types
type EntityAddListenerData           = { entity: Omit<IEntity | 'erd'>}
type EntityAddEmmitData              = { node: NodeType<NODE_TYPES.ENTITY> }

type EntityPatchListenerData         = { entityId: string, key: string, value: any }
type EntityPatchEmmitData            = EntityPatchListenerData

type EntityDeleteListenerData        = { entityId: string | string[] }
// type EntityDeleteEmmitData           = EntityDeleteListenerData

// Erd service - listener and emmiter types
type ErdPutListenerData             = Omit<IErd, 'team'| 'entities' | 'memos' | 'relations'>
type ErdPutEmmitData                = ErdPutListenerData

type ErdPatchListenerData           = { key: keyof ErdPutListenerData, value: any }
type ErdPatchEmmitData              = ErdPatchListenerData

// Node service - listener and emmiter types
type NodePatchPositionListenerData  = { nodeId: string, type: NODE_TYPES, position: {x: number, y: number} }[]
type NodePatchPositionEmmitData     = NodePatchPositionListenerData

type NodeDeleteEmitData             = { nodeId: string[] }

// Relation service - listener and emmiter types
export type RelationAddListenerData = { relation: Omit<ICRelation, 'erd'> }
type RelationAddEmmitData           = RelationAddListenerData

type RelationDeleteListenerData     = { relationId: string[] }
type RelationDeleteEmmitData        = RelationDeleteListenerData

type ClientToServerEvents = {

  // Player service events
  [PlayerEnum.subscribe]       : SocketDataHandler<PlayerSubscribeListenerData>
  [PlayerEnum.unsubscribe]     : SocketDataHandler<PlayerUnSubscribeListenerData>
  [PlayerEnum.viewportChange]  : SocketDataHandler<PlayerViewportListenerData>
  [PlayerEnum.mouseChange]     : SocketDataHandler<PlayerMouseChangeListenerData>

  // Column service events
  [ColumnEnum.add]             : SocketDataHandler<ColumnAddListenerData>
  [ColumnEnum.patch]           : SocketDataHandler<ColumnPatchListenerData>
  [ColumnEnum.delete]          : SocketDataHandler<ColumnDeleteListenerData>

  // Memo service events
  [MemoEnum.add]               : SocketDataHandler<MemoAddListenerData>
  [MemoEnum.patch]             : SocketDataHandler<MemoPatchListenerData>
  [MemoEnum.delete]            : SocketDataHandler<MemoDeleteListenerData>

  // Entity service events
  [EntityEnum.add]             : SocketDataHandler<EntityAddListenerData>
  [EntityEnum.patch]           : SocketDataHandler<EntityPatchListenerData>
  [EntityEnum.delete]          : SocketDataHandler<EntityDeleteListenerData>

  // Erd service events
  [ErdEnum.put]                : SocketDataHandler<ErdPutListenerData>
  [ErdEnum.patch]              : SocketDataHandler<ErdPatchListenerData>

  // Node service events
  [NodeEnum.patchPositions]     : SocketDataHandler<NodePatchPositionListenerData>

  // Relation service events
  [RelationEnum.add]           : SocketDataHandler<RelationAddListenerData>
  [RelationEnum.delete]        : SocketDataHandler<RelationDeleteListenerData>
}

type ServerToClientEvents = {

  // Worker events to client
  [WorkerEnum.join]            : SocketDataHandler<WorkerJoinEmmitData>
  [WorkerEnum.leave]           : SocketDataHandler<WorkerLeaveEmmitData>
  [WorkerEnum.data]            : SocketDataHandler<WorkerDataEmmitData>

  // Player service server to client events
  [PlayerEnum.subscribe]       : SocketDataHandler<PlayerSubscribeEmmitData>
  [PlayerEnum.unsubscribe]     : SocketDataHandler<PlayerUnSubscribeEmmitData>
  [PlayerEnum.viewportChange]  : SocketDataHandler<PlayerViewpointEmmitData>
  [PlayerEnum.mouseChange]     : SocketDataHandler<PlayerMouseChangeEmmitData>

  // Column service server to client events
  [ColumnEnum.add]             : SocketDataHandler<ColumnAddEmmitData>
  [ColumnEnum.patch]           : SocketDataHandler<ColumnPatchEmitData>
  [ColumnEnum.delete]          : SocketDataHandler<ColumnDeleteEmitData>

  // Memo service server to client events
  [MemoEnum.add]               : SocketDataHandler<MemoAddEmmitData>
  [MemoEnum.patch]             : SocketDataHandler<MemoPatchEmmitData>

  // Entity service server to client events
  [EntityEnum.patch]           : SocketDataHandler<EntityPatchEmmitData>

  //Erd service server to client events
  [ErdEnum.put]                : SocketDataHandler<ErdPutEmmitData>
  [ErdEnum.patch]              : SocketDataHandler<ErdPatchEmmitData>

  // Node service server to client events
  [NodeEnum.add]               : SocketDataHandler<EntityAddEmmitData | MemoAddEmmitData>
  [NodeEnum.patchPositions]    : SocketDataHandler<NodePatchPositionEmmitData>
  [NodeEnum.delete]            : SocketDataHandler<NodeDeleteEmitData>

  // Relation service server to client events
  [RelationEnum.add]           : SocketDataHandler<RelationAddEmmitData>
  [RelationEnum.delete]        : SocketDataHandler<RelationDeleteEmmitData>
}

export type MultiplayerSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type MultiplayerService = (args: ServiceArgs) => void
