import {create} from "zustand";
import {ITableNode, ITableNodeColumn, ITableNodeData} from "@/types/table-node";
import {applyEdgeChanges, applyNodeChanges, Edge} from "@xyflow/react";
import voca from "voca";
import {RELATIONS} from "@/constants/relations.ts";
import {createId} from "@paralleldrive/cuid2";
import {CallbackDataStatus, Column, Player, Relation, Table} from "@/enums/playground.ts";
import {notifications} from "@mantine/notifications";
import {orderBy} from "lodash";
import {IAddNodeProps, IConnectionData, IErdDiagram, IPlaygroundState} from "@/types/playground";
import {ICRelation} from "@/types/data/db-model-interfaces";


const initialState: IPlaygroundState = {
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "",
  isPublic: false,
  description: "",
  subscribedTo: null,
  viewport: {x: 0, y: 0, zoom: 1},
  subscribers: [],
  teamId: "",

  //Relations
  tables: [],
  relations: [],
  players: [],
  tool: "grab",
  playground: null as any,
  highlightedColumnId: null,
}


export const usePlaygroundStore = create<IErdDiagram>((set, getState) => ({
  ...initialState,

  // Views
  getNodes: () => getState().tables,
  getEdges: () => getState().relations,

  // Other
  setHighlightedColumnId: (id) => set({highlightedColumnId: id}),

  // Node Action
  nodeOnDragAdd: ({reactFlowInstance}: IAddNodeProps) => (e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData('application/reactflow');

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return;
    }
    const {tables} = getState()
    // @ts-ignore
    const targetIsPane = e.target.classList.contains('react-flow__pane');

    if (targetIsPane) {
      const id = createId();
      const columns: ITableNodeColumn[] = []
      const data: ITableNodeData = ({
        name: `table_${tables.length}`,
        color: "#006ab9",
        columns
      })
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY
      })
      const newNode = {
        id,
        type: "tableNode",
        position,
        data: data,
        createdAt: new Date(),
      };

      const {playground} = getState()
      playground.table(Table.add, newNode)
    }
  },

  // Relation  actions
  setTool: (tool) => set({tool}),
  addOneToOneRelations: (sourceNode, targetNode, data) => {
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name

    foreignKeys.forEach((column, i) => {
      const id = createId()
      const relation: ICRelation = {
        id,
        erdId: getState().id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATIONS.ONE_TO_ONE,
      }
      const newColumn: ITableNodeColumn = {
        ...column,
        id,
        tableId: targetNode.id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        order: 100 + i,
        autoIncrement: false,
        unique: true,
      }
      data.relations.push(relation)
      data.columns.push(newColumn)
    })
  },
  addOneToManyRelations: (sourceNode, targetNode, data) => {
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name

    foreignKeys.map((column, i) => {
      const id = createId()
      const relation: ICRelation = {
        id,
        erdId: getState().id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATIONS.ONE_TO_MANY,
      }
      data.relations.push(relation)
      data.columns.push({
        ...column,
        id,
        tableId: targetNode.id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        order: 100 + i,
        primary: false,
        autoIncrement: false,
        unique: false
      })
    })
  },
  addManyToManyRelations: (sourceNode, targetNode, data) => {

    const mnTable: ITableNode = {
      id: createId(),
      type: "tableNode",
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2
      },
      data: {
        name: sourceNode.data.name + targetNode.data.name,
        color: "#006ab9",
        columns: [],
      }
    }


    let order = 0

    function populateColumnsAndEdges(column: ITableNodeColumn, tableName: string, nodeId: string) {
      const id = createId()
      const relation: ICRelation = {
        id,
        erdId: getState().id,
        source: nodeId,
        target: mnTable.id,
        markerEnd: RELATIONS.ONE_TO_MANY,
      }
      data.relations.push(relation)
      mnTable.data.columns.push({
        ...column,
        tableId: mnTable.id,
        id,
        name: voca.snakeCase(tableName + voca.titleCase(column.name)),
        order,
        foreignKey: true,
        primary: false,
        unique: false
      })

      order++
    }

    sourceNode.data.columns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, sourceNode.data.name, sourceNode.id))
    targetNode.data.columns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, targetNode.data.name, targetNode.id))

    data.tables.push(mnTable)

  },
  setConnection: (connection) => {

    const state = getState()

    const targetNode = state.tables.find(node => node.id === connection.target)!
    const sourceNode = state.tables.find(node => node.id === connection.source)!

    if (targetNode.id === sourceNode.id) return state

    const data: IConnectionData = {
      relations: [],
      columns: [],
      tables: []
    }

    switch (state.tool) {
      case RELATIONS.ONE_TO_ONE:
        state.addOneToOneRelations(sourceNode, targetNode, data)
        break
      case RELATIONS.ONE_TO_MANY:
        state.addOneToManyRelations(sourceNode, targetNode, data)
        break
      case RELATIONS.MANY_TO_MANY:
        state.addManyToManyRelations(sourceNode, targetNode, data)
        break
    }


    data.tables.forEach(table => state.playground.table(Table.add, table))
    data.columns.forEach((column) => state.playground.column(Column.add, column))
    data.relations.forEach(relation => state.playground.relation(Relation.add, relation))

    set({tool: "grab"})
  },

  setNodeChanges: (nodeChanges) => {
    set(({tables: oldNodes, id: erdId, playground}) => {
      const nodesToUpdate: any[] = []
      const nodesToDelete: string[] = []
      nodeChanges.forEach((node) => {
        switch (node.type) {
          case "add":
            break
          case "replace":
            nodesToUpdate.push({
              erdId,
              id: node.item.id,
              type: node.item.type,
              position: node.item.position,
            })
            break
          case "position":
            const {id, type, position} = oldNodes.find(oldNode => oldNode.id === node.id)!

            if (position && node.position && position !== node.position) {
              nodesToUpdate.push({
                erdId,
                id,
                type,
                position: node.position!,
              })
            }

            break
          case "remove":
            nodesToDelete.push(node.id)
            break
        }
      })

      nodesToUpdate.forEach(node => {
        playground.table(Table.update, node)
      })

      nodesToDelete.forEach(nodeId => {
        playground.table(Table.delete, nodeId)
      })

      return ({tables: applyNodeChanges(nodeChanges, oldNodes) as ITableNode[]})
    })
  },
  setEdgeChanges: (edgeChanges) => {
    set(cur => {
      let targetNode: undefined | ITableNode
      edgeChanges.forEach(edge => {
        switch (edge.type) {
          case "add":
            break
          case "remove":
            cur.playground.relation(Relation.delete, cur.relations.find(r => r.id === edge.id) as Edge)
            break
          case "replace":
            break
          case "select":
            break
        }
      })

      return {
        relations: applyEdgeChanges(edgeChanges, cur.relations),
        tables: cur.tables.map(node => node.id === targetNode?.id ? targetNode : node)
      }
    })
  },
  setViewport: (viewport) => set({viewport}),
  reset: () => {
    console.log("RESETING STATE")
    set(initialState)
  },
  handlePlaygroundResponse: ({status, type, data}) => {
    if (status !== CallbackDataStatus.OK) {
      notifications.show({
        title: `type`,
        message: status,
        color: "var(--mantine-color-red-filled)"
      })
    } else {

      set(cur => {
          switch (type) {
            case Player.subscribe:
              return {subscribedTo: data, viewport: null}

            case Player.unsubscribe:
              return {subscribedTo: null, viewport: null}

            case Player.viewpointChange:
              return {}

            case Player.mouseChange:
              return {}

            case Table.add:
              return {tables: [...cur.tables, data]}

            case Table.update:
              return {}

            case Table.delete:
              return {tables: cur.tables.filter(t => t.id !== data)}

            case Table.set:
              return {
                tables: cur.tables.map(t => t.id === data.tableId ? {
                  ...t,
                  data: {...t.data, ...data.data}
                } : t)
              }

            case Relation.add:
              return {relations: [...cur.relations, data.relation]}

            case Relation.delete:
              return {relations: cur.relations.filter(r => r.id !== data.relation.id)}

            case Column.add:
              return {
                tables: cur.tables.map(table => {
                  if (table.id === data.column.tableId) {
                    return {
                      ...table,
                      data: {
                        ...table.data,
                        columns: [...table.data.columns, data.column]
                      }
                    }
                  }
                  return table
                })
              }

            case Column.update:
              return {
                tables: cur.tables.map(table => {
                  if (table.id === data.column.tableId) {
                    const columns = orderBy(table.data.columns.map(c => c.id === data.column.id ? data.column : c), 'order', 'asc')
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
              }

            case Column.delete:
              return {
                tables: cur.tables.map(table => {
                  if (table.id === data.column.tableId) {
                    return {
                      ...table,
                      data: {
                        ...table.data,
                        columns: table.data.columns.filter(c => c.id !== data.column.id)
                      }
                    }
                  }
                  return table
                })
              }

            default:
              return {}
          }

        }
      )
    }
  }
}))
