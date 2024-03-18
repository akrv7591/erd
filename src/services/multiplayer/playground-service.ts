import {connect, Socket} from "socket.io-client";
import {Edge} from "@xyflow/react";
import {
  CallbackDataStatus,
  ColumnEnum,
  EntityEnum,
  ErdEnum,
  MemoEnum,
  PlayerEnum,
  RelationEnum
} from "@/enums/playground.ts";
import {playerService} from "@/services/multiplayer/player-service.ts";
import {entityService} from "@/services/multiplayer/entity-service.ts";
import {relationService} from "@/services/multiplayer/relation-service.ts";
import {columnService} from "@/services/multiplayer/column-service.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {EntityNode, EntityNodeColumn} from "@/types/entity-node";
import {erdService} from "@/services/multiplayer/erd-service.ts";
import {memoService} from "@/services/multiplayer/memo-service.ts";
import {PROJECT} from "@/constants/project.ts";

export interface ResponseData<T> {
  type: T
  status: CallbackDataStatus
  data: any
}

export class PlaygroundService {
  readonly io: Socket

  constructor(playerId: string, playgroundId: string) {
    this.io = connect(PROJECT.BASE_API_URL, {
      auth: {playerId, playgroundId},
      withCredentials: true,
      reconnection: true,
    })
    this.initPlayground()
  }

  private initPlayground() {
    this.io.on("disconnect", () => usePlaygroundStore.setState(({connected: false})))
    this.io.on("data", data => usePlaygroundStore.setState(({...data, connected: true})))

    this.initErdListeners()
    this.initPlayerListeners()
    this.initTableListeners()
    this.initRelationListeners()
    this.initColumnListeners()
    this.initMemoListeners()
  }

  private initErdListeners() {
    const erd = erdService()

    this.io.on(ErdEnum.put, erd.onPut)
    this.io.on(ErdEnum.patch, erd.onPatch)
  }

  private initPlayerListeners() {
    const player = playerService()

    this.io.on(PlayerEnum.join, player.onJoin)
    this.io.on(PlayerEnum.leave, player.onLeave)
    this.io.on(PlayerEnum.subscribe, player.onSubscribe)
    this.io.on(PlayerEnum.unsubscribe, player.onUnsubscribe)
    this.io.on(PlayerEnum.viewpointChange, player.onViewportChange)
    this.io.on(PlayerEnum.mouseChange, player.onMouseChange)
  }

  private initTableListeners() {
    const entity = entityService()

    this.io.on(EntityEnum.add, entity.onAdd)
    this.io.on(EntityEnum.update, entity.onUpdate)
    this.io.on(EntityEnum.delete, entity.onDelete)
    this.io.on(EntityEnum.set, entity.onSet)

  }

  private initRelationListeners() {
    const relation = relationService()

    this.io.on(RelationEnum.add, relation.onAdd)
    this.io.on(RelationEnum.delete, relation.onDelete)
  }

  private initColumnListeners() {
    const column = columnService()

    this.io.on(ColumnEnum.add, column.onAdd)
    this.io.on(ColumnEnum.update, column.onUpdate)
    this.io.on(ColumnEnum.delete, column.onDelete)

  }

  private initMemoListeners() {
    const memo = memoService()

    this.io.on(MemoEnum.add, memo.onAdd)
    this.io.on(MemoEnum.put, memo.onPut)
    this.io.on(MemoEnum.patch, memo.onPatch)
    this.io.on(MemoEnum.delete, memo.onDelete)
  }

  public get handlePlaygroundResponse() {
    return usePlaygroundStore.getState().handlePlaygroundResponse
  }

  public erd(action: ErdEnum, data: any) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  public player(action: PlayerEnum, data: any | string) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  public table(action: EntityEnum, data: EntityNode | string | any) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  public relation(action: RelationEnum, data: Edge | string) {
    this.io.emit(action, data, this.handlePlaygroundResponse)
  }

  public memo(action: MemoEnum, data: any) {
    if (data.key === "content") {
      this.handlePlaygroundResponse({
        status: CallbackDataStatus.OK,
        data,
        type: action
      })
      this.io.emit(action, data, () => {
      })
    } else {
      this.io.emit(action, data, this.handlePlaygroundResponse)
    }
  }

  public column(action: ColumnEnum, data: {
    entityId: string,
    key: string,
    value: any,
    id: string
  } | EntityNodeColumn | string) {
    switch (action) {
      case ColumnEnum.update:
        this.handlePlaygroundResponse({
          status: CallbackDataStatus.OK,
          data: {
            column: data
          },
          type: action
        })
        this.io.emit(action, data, () => {})
        break
      default:
        this.io.emit(action, data, this.handlePlaygroundResponse)
    }
  }

}

