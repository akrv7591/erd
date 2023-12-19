import {Socket} from "socket.io-client";
import {MULTIPLAYER_SOCKET} from "@/constants/multiplayer.ts";
import {IErdNode} from "@/types/erd-node";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {ICColumn} from "@/types/data/column";
import {Edge, Viewport} from "reactflow";
import {orderBy} from "lodash";
import {useAuthStore} from "@/stores/useAuthStore.ts";

type IHandlerAction = "add" | "update" | "delete"
interface ResponseData {
  type: MULTIPLAYER_SOCKET
  status: "ok" | "failed"
  data: any
}
export class MultiplayerService {
  readonly io: Socket
  private readonly id: string

  constructor(io: Socket, id: string) {
    this.io = io
    this.id = id
    this.initListeners()
  }
  onCallback = (dataCallback?: Function) => ({status, type, data}: ResponseData) => {
    if (status !== "ok") {
      return console.error(type, ": ", status)
    }
    switch (type) {
      case MULTIPLAYER_SOCKET.ADD_PLAYER:
          console.log(data)
          useErdDiagramStore.setState({...data, multiplayer: this})
        break
      case MULTIPLAYER_SOCKET.REMOVE_PLAYER:
          useErdDiagramStore.setState(cur => ({players: cur.players.filter(player => player.id !== data)}))
        break
      case MULTIPLAYER_SOCKET.SUBSCRIBE_TO_PLAYER:
        dataCallback!({status, type, data})
        break
      case MULTIPLAYER_SOCKET.UNSUBSCRIBE_TO_PLAYER:
        dataCallback!({status, type, data})
        break
      case MULTIPLAYER_SOCKET.ON_USER_VIEWPORT_CHANGE:
        console.log("VIEWPORT_CHANGE_CALLBACK")
        break
      case MULTIPLAYER_SOCKET.ADD_TABLE:
        break
      case MULTIPLAYER_SOCKET.UPDATE_TABLE:
        break
      case MULTIPLAYER_SOCKET.DELETE_TABLE:
        break
      case MULTIPLAYER_SOCKET.ADD_RELATION:
        break
      case MULTIPLAYER_SOCKET.DELETE_RELATION:
        break
      case MULTIPLAYER_SOCKET.ADD_TABLE_COLUMN:
        break
      case MULTIPLAYER_SOCKET.UPDATED_TABLE_COLUMN:
        break
      case MULTIPLAYER_SOCKET.DELETE_TABLE_COLUMN:
        break
      case MULTIPLAYER_SOCKET.SET_TABLE_DATA:
        break
      case MULTIPLAYER_SOCKET.SUBSCRIBE_TO_TABLE_DATE:
        break

    }
  }

  // User
  joinRoom = (userId: string) => this.io.emit(MULTIPLAYER_SOCKET.ADD_PLAYER, this.id, userId, this.onCallback())
  leaveRoom = (userId: string) => this.io.emit(MULTIPLAYER_SOCKET.REMOVE_PLAYER, this.id, userId, this.onCallback())
  subscribeToPlayer = (targetPlayerId: string, dataCallback: Function) => this.io.emit(MULTIPLAYER_SOCKET.SUBSCRIBE_TO_PLAYER, useAuthStore.getState().getAuthorization()?.id, targetPlayerId, this.onCallback(dataCallback))
  unsubscribeToPlayer = (targetPlayerId: string, dataCallback: Function) => this.io.emit(MULTIPLAYER_SOCKET.UNSUBSCRIBE_TO_PLAYER, useAuthStore.getState().getAuthorization()?.id, targetPlayerId, this.onCallback(dataCallback))
  handleSubscribeData = (type: "viewport" | "mouse", data: any) => {
    switch (type) {
      case "viewport":
        this.io.emit(MULTIPLAYER_SOCKET.ON_USER_VIEWPORT_CHANGE, useAuthStore.getState().getAuthorization()?.id, data, this.onCallback())
    }
  }
  // Table
  handleTable(action: IHandlerAction, table: IErdNode | string) {
    switch (action) {
      case "add":
        this.io.emit(MULTIPLAYER_SOCKET.ADD_TABLE, table, this.onCallback())
        break
      case "update":
        this.io.emit(MULTIPLAYER_SOCKET.UPDATE_TABLE, table, this.onCallback())
        break
      case "delete":
        this.io.emit(MULTIPLAYER_SOCKET.DELETE_TABLE, table, this.onCallback())
    }
  }

  handleRelation(action: IHandlerAction, relation: Edge | string) {
    switch (action) {
      case "add":
        this.io.emit(MULTIPLAYER_SOCKET.ADD_RELATION, relation, this.onCallback())
        break
      case "delete":
        this.io.emit(MULTIPLAYER_SOCKET.DELETE_RELATION, relation, this.onCallback())
        break
    }
  }

  handleColumn(action: IHandlerAction, tableId: string, column: ICColumn | string) {
    switch (action) {
      case "add":
        this.io.emit(MULTIPLAYER_SOCKET.ADD_TABLE_COLUMN, tableId, column, this.onCallback())
        break
      case "update":
        this.io.emit(MULTIPLAYER_SOCKET.UPDATED_TABLE_COLUMN, tableId, column, this.onCallback())
        break
      case "delete":
        this.io.emit(MULTIPLAYER_SOCKET.DELETE_TABLE_COLUMN, tableId, column, this.onCallback())
        break
    }
  }

  handleTableData = (tableId: string, key: string, value: string) => this.io.emit(MULTIPLAYER_SOCKET.SET_TABLE_DATA, tableId, key, value, this.onCallback())
  subscribeToTableData = (tableId: string) => this.io.emit(MULTIPLAYER_SOCKET.SUBSCRIBE_TO_TABLE_DATE, tableId, this.onCallback())



  private initListeners() {
    // User listeners
    this.io.on(MULTIPLAYER_SOCKET.ADD_PLAYER, newPlayer => {
      useErdDiagramStore.setState(cur => ({players: [...cur.players, newPlayer]}))
    })
    this.io.on(MULTIPLAYER_SOCKET.REMOVE_PLAYER, removedPlayerId => {
      useErdDiagramStore.setState(cur => ({players: cur.players.filter(player => player.id !== removedPlayerId)}))
    })
    this.io.on(MULTIPLAYER_SOCKET.ON_USER_VIEWPORT_CHANGE, (data: Viewport) => {
      useErdDiagramStore.getState().setViewport(data)
    })

    // Table listeners
    this.io.on(MULTIPLAYER_SOCKET.ADD_TABLE, addedTable => {
      useErdDiagramStore.setState(cur => ({tables: [...cur.tables, addedTable]}))
    })
    this.io.on(MULTIPLAYER_SOCKET.UPDATE_TABLE, updatedTable => {
      useErdDiagramStore.setState(cur => ({tables: cur.tables.map(table => table.id === updatedTable.id ? {...table, ...updatedTable} : table)}))
    })
    this.io.on(MULTIPLAYER_SOCKET.DELETE_TABLE, deletedTableId => {
      useErdDiagramStore.setState(cur => ({tables: cur.tables.filter(table => table.id !== deletedTableId)}))
    })

    // Relation listeners
    this.io.on(MULTIPLAYER_SOCKET.ADD_RELATION, relation => {
      useErdDiagramStore.setState(cur => ({relations: [...cur.relations, relation]}))
    })
    this.io.on(MULTIPLAYER_SOCKET.DELETE_RELATION, relationId => {
      useErdDiagramStore.setState(cur => ({relations: cur.relations.filter(relation => relation.id !== relationId)}))
    })

    // Table column listeners
    this.io.on(MULTIPLAYER_SOCKET.ADD_TABLE_COLUMN, (tableId, column) => {
      useErdDiagramStore.setState(cur => ({
        tables: cur.tables.map(table => {
          if (table.id === tableId) {
            return {
              ...table,
              data: {
                ...table.data,
                columns: [...table.data.columns, column]
              }
            }
          }
          return table
        })
      }))
      console.log(`RECEIVED COLUMN ADD ON ${tableId}`, column)
    })
    this.io.on(MULTIPLAYER_SOCKET.UPDATED_TABLE_COLUMN, (tableId, column) => {
      useErdDiagramStore.setState(cur => ({
        tables: cur.tables.map(table => {
          if (table.id === tableId) {
            const columns = orderBy(table.data.columns.map(c => c.id === column.id ? column : c), 'order', 'asc')
            return {
              ...table,
              data: {
                ...table.data,
                columns
              }
            }
          }
          return table
        })
      }))
      console.log(`RECEIVED COLUMN UPDATE ON ${tableId}`)

    })
    this.io.on(MULTIPLAYER_SOCKET.DELETE_TABLE_COLUMN, (tableId, column) => {
      useErdDiagramStore.setState(cur => ({
        tables: cur.tables.map(table => {
          if (table.id === tableId) {
            return {
              ...table,
              data: {
                ...table.data,
                columns: table.data.columns.filter(c => c.id !== column)
              }
            }
          }
          return table
        })
      }))
      console.log(`RECEIVED COLUMN DELETE ON ${tableId}`)
    })

    this.io.on(MULTIPLAYER_SOCKET.SET_TABLE_DATA, (tableId, key, value) => {
      console.table({tableId, key, value})
      useErdDiagramStore.setState(cur => ({
        tables: cur.tables.map(table => {
          if (table.id === tableId) {
            return {
              ...table,
              data: {
                ...table.data,
                [key]: value,
              }
            }
          }

          return table
        })
      }))
    })
  }
}
