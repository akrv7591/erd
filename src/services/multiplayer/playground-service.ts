import {Socket} from "socket.io-client";
import {IErdNode} from "@/types/erd-node";
import {Edge} from "reactflow";
import {CallbackDataStatus, Column, Player, Relation, Table} from "@/enums/playground.ts";
import {playerService} from "services/multiplayer/player-service.ts";
import {tableService} from "services/multiplayer/table-service.ts";
import {relationService} from "services/multiplayer/relation-service.ts";
import {columnService} from "services/multiplayer/column-service.ts";
import {ICColumn} from "@/types/data/column";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";

Object.entries(Player).forEach(([key, value]) => {
  console.log({[key]: value})
})

export interface ResponseData<T> {
  type: T
  status: CallbackDataStatus
  data: any
}

export class PlaygroundService {
  readonly io: Socket

  constructor(io: Socket) {
    this.io = io

    this.initPlayerListeners()
    this.initTableListeners()
    this.initRelationListeners()
    this.initColumnListeners()
  }

  private initPlayerListeners() {
    const player = playerService()

    this.io.on(Player.join, player.onJoin)
    this.io.on(Player.leave, player.onLeave)
    this.io.on(Player.subscribe, player.onSubscribe)
    this.io.on(Player.unsubscribe, player.onUnsubscribe)
    this.io.on(Player.viewpointChange, player.onViewportChange)
    this.io.on(Player.mouseChange, player.onMouseChange)
  }

  private initTableListeners() {
    const table = tableService()

    this.io.on(Table.add, table.onAdd)
    this.io.on(Table.update, table.onUpdate)
    this.io.on(Table.delete, table.onDelete)
    this.io.on(Table.set, table.onSet)

  }

  private initRelationListeners() {
    const relation = relationService()

    this.io.on(Relation.add, relation.onAdd)
    this.io.on(Relation.delete, relation.onDelete)
  }

  private initColumnListeners() {
    const column = columnService()

    this.io.on(Column.add, column.onAdd)
    this.io.on(Column.update, column.onUpdate)
    this.io.on(Column.delete, column.onDelete)

  }

  public player(action: Player, data: any | string) {
    this.io.emit(action, data, useErdDiagramStore.getState().handlePlaygroundResponse)
  }

  public table(action: Table, data: IErdNode | string | any) {
    this.io.emit(action, data, useErdDiagramStore.getState().handlePlaygroundResponse)
  }

  public relation(action: Relation, data: Edge | string) {
    this.io.emit(action, data, useErdDiagramStore.getState().handlePlaygroundResponse)
  }

  public column(action: Column,  data: ICColumn | string) {
    this.io.emit(action, data, useErdDiagramStore.getState().handlePlaygroundResponse)
  }

}
