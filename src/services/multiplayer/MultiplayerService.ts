import {Socket} from "socket.io-client";
import {MULTIPLAYER_SOCKET} from "../../constants/multiplayer.ts";
import {IErdNode} from "../../types/erd-node";
import {useErdDiagramStore} from "../../stores/useErdDiagramStore.ts";
import {ICColumn} from "../../types/data/column";
import {Edge} from "reactflow";
import {orderBy} from "lodash";

type IHandlerAction = "add" | "update" | "delete"

export class MultiplayerService {
  readonly io: Socket
  private readonly id: string

  constructor(io: Socket, id: string) {
    this.io = io
    this.id = id
    this.initListeners()
  }

  // User
  joinRoom(userId: string) {
    this.io.emit(MULTIPLAYER_SOCKET.ADD_PLAYER, this.id, userId, (roomData: any) => {
      console.log("USER JOINED, TOTAL_USERS", roomData.players.length)
      console.log(roomData)
      useErdDiagramStore.setState({...roomData, multiplayer: this})
    })
  }

  leaveRoom(userId: string) {
    this.io.emit(MULTIPLAYER_SOCKET.REMOVE_PLAYER, this.id, userId, () => {
      useErdDiagramStore.setState(cur => ({players: cur.players.filter(player => player.id !== userId)}))
    })
  }

  // Table
  handleTable(action: IHandlerAction, table: IErdNode | string) {
    switch (action) {
      case "add":
        this.io.emit(MULTIPLAYER_SOCKET.ADD_TABLE, table, () => {
          console.log(`TABLE ADDED: `, table)
        })
        break
      case "update":
        this.io.emit(MULTIPLAYER_SOCKET.UPDATE_TABLE, table, () => {
          console.log(`TABLE UPDATED: `, table)
        })
        break
      case "delete":
        this.io.emit(MULTIPLAYER_SOCKET.DELETE_TABLE, table, () => {
          console.log(`TABLE DELETED: `, table)
        })
    }
  }

  handleRelation(action: IHandlerAction, relation: Edge | string) {
    switch (action) {
      case "add":
        this.io.emit(MULTIPLAYER_SOCKET.ADD_RELATION, relation, () => {
          console.log(`ADDED ${relation} successfully`)
        })
        break
      case "delete":
        this.io.emit(MULTIPLAYER_SOCKET.DELETE_RELATION, relation, () => {
          console.log(`DELETED ${relation} relation`)
        })
        break
    }
  }

  handleColumn(action: IHandlerAction, tableId: string, column: ICColumn | string) {
    switch (action) {
      case "add":
        this.io.emit(MULTIPLAYER_SOCKET.ADD_TABLE_COLUMN, tableId, column, () => {
          console.log(`NEW_COLUMN ADDED to ${tableId}: `, column)
        })
        break
      case "update":
        this.io.emit(MULTIPLAYER_SOCKET.UPDATED_TABLE_COLUMN, tableId, column, () => {
          console.log(`UPDATED_COLUMN UPDATED:`, column)
        })
        break
      case "delete":
        this.io.emit(MULTIPLAYER_SOCKET.DELETE_TABLE_COLUMN, tableId, column, () => {
          console.log(`COLUMN DELETED:`, column)
        })
        break
    }
  }

  handleTableData(tableId: string, key: string, value: string) {
    this.io.emit(MULTIPLAYER_SOCKET.SET_TABLE_DATA, tableId, key, value, () => {
      console.log("TABLE DATA SUCCESSFULLY UPDATED")
    })
  }

  subscribeToTableData(tableId: string) {
    this.io.emit(MULTIPLAYER_SOCKET.SUBSCRIBE_TO_TABLE_DATE, tableId, () => {
      console.log(`SUBSCRIBED TO ${tableId} DATA`)
    })
  }


  private initListeners() {
    // User listeners
    this.io.on(MULTIPLAYER_SOCKET.ADD_PLAYER, newPlayer => {
      useErdDiagramStore.setState(cur => ({players: [...cur.players, newPlayer]}))
    })
    this.io.on(MULTIPLAYER_SOCKET.REMOVE_PLAYER, removedPlayerId => {
      useErdDiagramStore.setState(cur => ({players: cur.players.filter(player => player.id !== removedPlayerId)}))
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
            const columns = orderBy(table.data.columns.map(c => c.id === column.id? column: c), 'order', 'asc')
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
