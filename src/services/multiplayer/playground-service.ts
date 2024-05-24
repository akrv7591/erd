import {connect, Socket} from "socket.io-client";
import {Edge, ReactFlowInstance} from "@xyflow/react";
import {ColumnEnum, EntityEnum, ErdEnum, MemoEnum, NodeEnum, PlayerEnum, RelationEnum} from "@/enums/playground.ts";
import {playerService} from "@/services/multiplayer/player-service.ts";
import {entityService} from "@/services/multiplayer/entity-service.ts";
import {relationService} from "@/services/multiplayer/relation-service.ts";
import {columnService, ColumnWebsocketPatch} from "@/services/multiplayer/column-service.ts";
import {erdService} from "@/services/multiplayer/erd-service.ts";
import {memoService, MemoWebsocketPatch} from "@/services/multiplayer/memo-service.ts";
import {PROJECT} from "@/constants/project.ts";
import {nodeService} from "@/services/multiplayer/node-service.ts";
import {SOCKET} from "@/constants/socket.ts";
import type {ICMemo} from "@/types/data/db-model-interfaces";
import type {EntityNode, EntityNodeColumn} from "@/types/entity-node";
import {NodeType} from "@/types/playground";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {PlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";

export class PlaygroundService {
  readonly io: Socket
  readonly reactFlow: ReactFlowInstance
  readonly nodesType: Map<string, NODE_TYPES> = new Map()
  readonly playgroundStore: PlaygroundStore

  constructor(playerId: string, playgroundId: string, reactFlow: ReactFlowInstance, playgroundStore: PlaygroundStore) {
    this.io = connect(PROJECT.BASE_API_URL, {
      auth: {playerId, playgroundId, type: SOCKET.TYPE.ERD},
      withCredentials: true,
      reconnection: true,
    })
    this.reactFlow = reactFlow
    this.playgroundStore = playgroundStore
    this.initPlayground()
  }

  get serviceArgs(): ServiceArgs {
    return {store: this.playgroundStore, reactFlow: this.reactFlow, socket: this.io}
  }

  private initPlayground() {
    this.io.on("disconnect", () => this.playgroundStore.setState(({connected: false})))
    this.io.on("data", (data) => {
      data.nodes.forEach((node: NodeType) => this.nodesType.set(node.id, node.type!))
      this.playgroundStore.setState({...data, connected: true})

      this.initErdListeners()
      this.initPlayerListeners()
      this.initEntityListeners()
      this.initRelationListeners()
      this.initColumnListeners()
      this.initMemoListeners()
      this.initNodeListeners()
    })
  }

  private initErdListeners() {
    const erd = erdService(this.serviceArgs)

    this.io.on(ErdEnum.put, erd.onPut)
    this.io.on(ErdEnum.patch, erd.onPatch)
  }

  private initPlayerListeners() {
    const player = playerService(this.serviceArgs)

    this.io.on(PlayerEnum.join, player.onJoin)
    this.io.on(PlayerEnum.leave, player.onLeave)
    this.io.on(PlayerEnum.subscribe, player.onSubscribe)
    this.io.on(PlayerEnum.unsubscribe, player.onUnsubscribe)
    this.io.on(PlayerEnum.viewpointChange, player.onViewportChange)
    this.io.on(PlayerEnum.mouseChange, player.onMouseChange)
  }

  private initNodeListeners() {
    const node = nodeService(this.serviceArgs)

    this.io.on(NodeEnum.add, node.onAdd)
    this.io.on(NodeEnum.patchPositions, node.onPatchPositions)
    this.io.on(NodeEnum.delete, node.onDelete)
  }

  private initEntityListeners() {
    const entity = entityService(this.serviceArgs)

    this.io.on(EntityEnum.patch, entity.onPatch)
  }

  private initRelationListeners() {
    const relation = relationService(this.serviceArgs)

    this.io.on(RelationEnum.add, relation.onAdd)
    this.io.on(RelationEnum.delete, relation.onDelete)
  }

  private initColumnListeners() {
    const column = columnService(this.serviceArgs)

    this.io.on(ColumnEnum.add, column.onAdd)
    this.io.on(ColumnEnum.patch, column.onPatch)
    this.io.on(ColumnEnum.delete, column.onDelete)

  }

  private initMemoListeners() {
    const memo = memoService(this.serviceArgs)

    this.io.on(MemoEnum.patch, memo.onPatch)
  }

  public get handlePlaygroundResponse() {
    return this.playgroundStore.getState().handlePlaygroundResponse
  }

  public erd(action: ErdEnum, data: any) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  public player(action: PlayerEnum, data: any | string) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  public entity(action: EntityEnum, data: EntityNode | EntityNode[] | string | any) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  relation(action: RelationEnum.add, data: Edge): void
  relation(action: RelationEnum.delete, data: string[]): void
  relation(action: RelationEnum, data: Edge | string[]) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  node(action: NodeEnum, data: { [key: string]: string }) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  memo(action: MemoEnum.add, data: ICMemo): void
  memo(action: MemoEnum.patch, data: MemoWebsocketPatch): void
  memo(action: MemoEnum.delete, data: string[]): void
  memo(action: MemoEnum, data: ICMemo | MemoWebsocketPatch | string[]) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }


  column(action: ColumnEnum.add, data: EntityNodeColumn): void;
  column(action: ColumnEnum.patch, data: ColumnWebsocketPatch): void
  column(action: ColumnEnum.delete, data: string[], entityId: string): void
  column(action: ColumnEnum, data: ColumnWebsocketPatch | EntityNodeColumn | string[], entityId ?: string): void {
    switch (action) {
      case ColumnEnum.delete:
        this.io.emit(action, data, entityId, this.handlePlaygroundResponse)
        break
      default:
        this.io.emit(action, data, this.handlePlaygroundResponse)
    }
  }

  handleMouseMove = (pos: { x: number, y: number } | null) => {
    if (pos) {
      pos = this.reactFlow.screenToFlowPosition(pos, {snapToGrid: false})
    }

    this.player(PlayerEnum.mouseChange, pos)
  }
}

