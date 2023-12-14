import {create} from "zustand";
import {IErdNode, IErdNodeColumn, IErdNodeData, ITools} from "../types/erd-node";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  ReactFlowInstance
} from "reactflow";
import voca from "voca";
import {RELATIONS} from "../constants/relations.ts";
import {createId} from "@paralleldrive/cuid2";
import {ICRelation} from "../types/data/relations";
import {ICColumn} from "../types/data/column";
import {IErd} from "../types/data/erd";
import {IUser} from "../types/data/user";
import {MultiplayerService} from "../services/multiplayer/MultiplayerService.ts";

interface IAddNodeProps {
  e: any
  reactFlowWrapper: any;
  reactFlowInstance: ReactFlowInstance
}

interface IConnectionData {
  relations: Edge[]
  columns: { tableId: string, column: ICColumn }[]
  tables: IErdNode[]
}

export interface IErdDiagramState extends Omit<IErd, 'users' | 'relations' | 'tables'> {
  tool: ITools;
  players: IUser[],
  tables: IErdNode[],
  relations: Edge[],
  multiplayer: MultiplayerService
}

export interface IErdDiagramViews {
  getNodeData: (nodeId: string) => IErdNodeData
  getNodes: () => IErdNode[]
  getEdges: () => Edge[]
}

export interface IErDiagramActions {
  // Actions

  // Node actions
  setNodes: (nodes: IErdNode[]) => void
  setNodeChanges: (nodeChanges: NodeChange[]) => void
  addTableOnClick: (props: IAddNodeProps) => void

  // Relation actions
  setEdges: (edges: Edge[]) => void
  setEdgeChanges: (edgeChanges: EdgeChange[]) => void
  setConnection: (connection: Connection) => void
  addOneToOneRelations: (sourceNode: IErdNode, targetNode: IErdNode, data: IConnectionData) => void
  addOneToManyRelations: (sourceNode: IErdNode, targetNode: IErdNode, data: IConnectionData) => void
  addManyToManyRelations: (sourceNode: IErdNode, targetNode: IErdNode, data: IConnectionData) => void

  // Tools
  setTool: (tool: ITools) => void

  // Other
  reset: () => void
}

const initialState: IErdDiagramState = {
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "",
  isPublic: false,
  description: "",

  //Relations
  tables: [],
  relations: [],
  players: [],
  tool: "grab",
  multiplayer: {} as MultiplayerService,
}

type IErdDiagram = IErdDiagramState & IErdDiagramViews & IErDiagramActions

export const useErdDiagramStore = create<IErdDiagram>((set, getState) => ({
  ...initialState,

  // Views
  getNodeData: (tableId) => getState().tables.find(table => table.id === tableId)!.data,
  getNodes: () => getState().tables,
  getEdges: () => getState().relations,


  // Node Action
  setNodes: (tables) => set({tables}),
  addTableOnClick: ({e, reactFlowWrapper, reactFlowInstance}) => {
    const {tool, tables} = getState()
    if (tool !== 'add-table') return {}

    const targetIsPane = e.target.classList.contains('react-flow__pane');

    if (targetIsPane && reactFlowWrapper.current) {
      const id = createId();
      const columns: IErdNodeColumn[] = []
      const data: IErdNodeData = ({
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

      const {multiplayer} = getState()
      multiplayer.handleTable("add", newNode)
    }
  },

  // Relation  actions
  setEdges: (relations) => set({relations}),
  setTool: (tool) => set({tool}),
  addOneToOneRelations: (sourceNode, targetNode, data) => {
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name

    foreignKeys.forEach((column, i) => {
      const id = createId()
      const relation: ICRelation = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATIONS.ONE_TO_ONE,
      }
      const newColumn: ICColumn = {
        ...column,
        id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        order: 100 + i,
        autoIncrement: false,
        unique: true,
      }
      data.relations.push(relation)
      data.columns.push({tableId: targetNode.id, column: newColumn})
    })
  },
  addOneToManyRelations: (sourceNode, targetNode, data) => {
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name

    foreignKeys.map((column, i) => {
      const id = createId()
      const relation: ICRelation = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATIONS.ONE_TO_MANY,
      }
      data.relations.push(relation)
      data.columns.push({
        tableId: targetNode.id,
        column: {
          ...column,
          id,
          name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
          foreignKey: true,
          order: 100 + i,
          primary: false,
          autoIncrement: false,
          unique: false
        }
      })
    })
  },
  addManyToManyRelations: (sourceNode, targetNode, data) => {

    const mnTable: IErdNode = {
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

    function populateColumnsAndEdges(column: IErdNodeColumn, tableName: string, nodeId: string) {
      const id = createId()
      const relation: ICRelation = {
        id,
        source: nodeId,
        target: mnTable.id,
        markerEnd: RELATIONS.ONE_TO_MANY,
      }
      data.relations.push(relation)
      mnTable.data.columns.push({
        ...column,
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

    data.tables.forEach(table => getState().multiplayer.handleTable("add", table))
    data.columns.forEach(({tableId, column}) => getState().multiplayer.handleColumn("add", tableId, column))
    data.relations.forEach(relation => getState().multiplayer.handleRelation("add", relation))

    set({tool: "grab"})
  },

  setNodeChanges: (nodeChanges) => {
    set(({tables: oldNodes, id: erdId}) => {
      const nodesToUpdate: any[] = []
      const nodesToDelete: string[] = []
      nodeChanges.forEach((node) => {
        switch (node.type) {
          case "reset":
            // nodesToUpdate.push({
            //   erdId,
            //   id: node.item.id,
            //   type: node.item.type,
            //   position: node.item.position,
            // })
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
        getState().multiplayer.handleTable("update", node)
      })

      nodesToDelete.forEach(nodeId => {
        getState().multiplayer.handleTable("delete", nodeId)
      })

      return ({tables: applyNodeChanges(nodeChanges, oldNodes) as IErdNode[]})
    })
  },
  setEdgeChanges: (edgeChanges) => {
    set(cur => {
      let targetNode: undefined | IErdNode
      edgeChanges.forEach(edge => {
        console.log(edge)
        switch (edge.type) {
          case "add":
            console.log("edge added")
            break
          case "remove":
            // erdApi.delete(`/v1/erd/${cur.id}/relation/${edge.id}$}`)
            // targetNode = cur.tables.find(node => node.data.columns.map(column => column.id).includes(edge.id))
            //
            // if (targetNode) {
            //   targetNode.data.columns = targetNode.data.columns.filter(column => column.id !== edge.id)
            //   targetNode.updatedAt = new Date()
            // }
            console.log(edge)
            getState().multiplayer.handleRelation("delete", edge.id)
            break
          case "reset":
            console.log("edge maybe added")
            break
          case "select":
            console.log("edge selected")
            break
        }
      })

      return {
        relations: applyEdgeChanges(edgeChanges, cur.relations),
        tables: cur.tables.map(node => node.id === targetNode?.id ? targetNode : node)
      }
    })
  },
  reset: () => set(initialState)
}))
