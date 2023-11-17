import {create} from "zustand";
import {IErdNode, IErdNodeColumn, IErdNodeData, ITools} from "../../types/erd-node";
import {applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, NodeChange, Project} from "reactflow";
import voca from "voca";
import {RELATIONS} from "../../constants/relations";
import erdApi from "../../api/erdApi.tsx";
import {createId} from "@paralleldrive/cuid2";
import httpStatus from "http-status";
import {ICRelation} from "../../types/data/relations";
import {ICColumn} from "../../types/data/column";
import {connect, Socket} from "socket.io-client";

interface IAddNodeProps {
  e: any
  reactFlowWrapper: any;
  project: Project
}

export interface IErdDiagramState {
  erdId: string;
  tool: ITools;
  dragPane: boolean;
  nodes: IErdNode[];
  edges: Edge[];
  multiplayer: Socket

}

export interface IErdDiagramViews {
  getNodeData: (nodeId: string) => IErdNodeData
}

export interface IErDiagramActions {
  // Actions
  setNodes: (nodes: IErdNode[]) => void
  setEdges: (edges: Edge[]) => void
  setTool: (tool: ITools) => void
  addNode: (props: IAddNodeProps) => void
  deleteNode: (nodeId: string) => void
  setConnection: (connection: Connection) => void
  addOneToOneRelations: (sourceNode: IErdNode, targetNode: IErdNode) => void
  addOneToManyRelations: (sourceNode: IErdNode, targetNode: IErdNode) => void
  addManyToManyRelations: (sourceNode: IErdNode, targetNode: IErdNode) => void
  addRelation: (relation: ICRelation) => void
  addColumn: (column: ICColumn, tableId: string) => void
  setDragPane: (dragPane: boolean) => void
  setErdId: (erdId: string) => void
  setState: (state: Partial<IErdDiagramState>) => void
  setNodeChanges: (nodeChanges: NodeChange[]) => void
  setEdgeChanges: (edgeChanges: EdgeChange[]) => void
  reset: () => void
}

const initialState: IErdDiagramState = {
  erdId: "",
  tool: "grab",
  dragPane: true,
  nodes: [],
  edges: [],
  multiplayer: connect("http://127.0.0.1:3001")
}

export const useErdDiagramStore = create<IErdDiagramState & IErdDiagramViews & IErDiagramActions>()((set, getState) => ({
  ...initialState,

  // Views
  getNodeData: (nodeId) => getState().nodes.find(node => node.id === nodeId)!.data,

  // Action
  setNodes: (nodes) => {
    set({nodes})
  },
  setEdges: (edges) => {
    set({edges})
  },
  setTool: (tool) => set({tool}),
  addNode: ({e, reactFlowWrapper, project}) => set(state => {
    if (state.tool !== 'add-table') return {}

    const targetIsPane = e.target.classList.contains('react-flow__pane');

    if (targetIsPane && reactFlowWrapper.current) {
      const {top, left} = reactFlowWrapper.current.getBoundingClientRect();
      const id = createId();
      const columns: IErdNodeColumn[] = []
      const data: IErdNodeData = ({
        name: `table_${state.nodes.length}`,
        columns,
        color: "var(--mantine-color-dark-6)"
      })
      const newNode = {
        id,
        type: "tableNode",
        position: project({x: e.clientX - left - 75, y: e.clientY - top}),
        data: data
      };
      return {nodes: [...state.nodes, newNode], tool: "grab"} as Partial<IErdDiagramState>
    }

    return {tool: "grab"}
  }),
  deleteNode: (nodeId) => set(state => ({nodes: state.nodes.filter(node => node.id !== nodeId)})),
  addOneToOneRelations: (sourceNode, targetNode) => {
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name
    const edges: Edge[] = []
    const data = {...targetNode.data}

    foreignKeys.map(column => {
      const id = createId()
      const relation: ICRelation = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATIONS.ONE_TO_ONE,
      }
      const {addRelation, addColumn} = getState()
      addRelation(relation)
      edges.push(relation)
      const newColumn: ICColumn = {
        ...column,
        id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        order: data.columns.length,
        autoIncrement: false,
        unique: true,
      }

      console.log(newColumn)

      addColumn(newColumn, targetNode.id)
      data.columns.push(newColumn as IErdNodeColumn)
    })

    console.log(edges)

    set(cur => ({
      edges: [...cur.edges, ...edges],
      nodes: cur.nodes.map(node => node.id === targetNode.id ? {...targetNode, data} : node)
    }))
  },
  addOneToManyRelations: (sourceNode, targetNode) => {
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name
    const edges: Edge[] = []
    const data = {...targetNode.data}

    foreignKeys.map(column => {
      const id = createId()
      const relation: ICRelation = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATIONS.ONE_TO_MANY,
      }
      getState().addRelation(relation)
      edges.push(relation)

      data.columns.push({
        ...column,
        id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        order: data.columns.length,
        primary: false,
        autoIncrement: false,
        unique: false
      })
    })

    set(cur => ({
      edges: [...cur.edges, ...edges],
      nodes: cur.nodes.map(node => node.id === targetNode.id ? {...targetNode, data} : node)
    }))
  },
  addManyToManyRelations: (sourceNode, targetNode) => {
    const edges: Edge[] = []
    const columns: IErdNodeColumn[] = []

    const mnTable: IErdNode = {
      id: createId(),
      type: "tableNode",
      position: {
        x: Math.abs(sourceNode.position.x + targetNode.position.x) / 2,
        y: Math.abs(sourceNode.position.y + targetNode.position.y) / 2
      },
      data: {
        name: sourceNode.data.name + targetNode.data.name,
        columns,
        color: "var(--mantine-color-dark-6)"
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
      getState().addRelation(relation)
      edges.push(relation)

      columns.push({
        ...column,
        id,
        name: voca.snakeCase(tableName + voca.titleCase(column.name)),
        order,
        primary: true,
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


    set(cur => ({
        nodes: [...cur.nodes, mnTable],
        edges: [...cur.edges, ...edges]
      })
    )
  },
  setConnection: (connection) => {
    const state = getState()

    const targetNode = state.nodes.find(node => node.id === connection.target)!
    const sourceNode = state.nodes.find(node => node.id === connection.source)!

    if (targetNode.id === sourceNode.id) return state

    switch (state.tool) {
      case RELATIONS.ONE_TO_ONE:
        state.addOneToOneRelations(sourceNode, targetNode)
        break
      case RELATIONS.ONE_TO_MANY:
        state.addOneToManyRelations(sourceNode, targetNode)
        break
      case RELATIONS.MANY_TO_MANY:
        state.addManyToManyRelations(sourceNode, targetNode)
        break
    }

    set({tool: "grab"})
  },
  addRelation: (relation) => {
    erdApi.post(`/v1/erd/${getState().erdId}/relation`, relation)
      .then(() => console.log("Successfully added relation"))
      .catch(() => console.log("Failed to add relation"))
  },
  addColumn: (column, tableId) => {
    erdApi.put(`/v1/erd/${getState().erdId}/table/${tableId}/column`, column)
      .then(() => console.log("Column added successfully"))
      .catch(() => console.log("Failed to add column"))
  },
  setDragPane: (dragPane: boolean) => set({dragPane}),
  setErdId: (erdId) => set({erdId}),
  setState: (state) => set(state),
  setNodeChanges: (nodeChanges) => {
    set(({nodes: oldNodes, erdId}) => {
      const nodesToUpdate: any[] = []
      const nodesToDelete: string[] = []
      nodeChanges.forEach((node) => {
        switch (node.type) {
          case "reset":
            const {columns, ...d} = node.item.data
            nodesToUpdate.push({
              erdId,
              id: node.item.id,
              type: node.item.type,
              position: node.item.position,
              data: d
            })
            break
          case "position":
            const {id, type, position, data} = oldNodes.find(oldNode => oldNode.id === node.id)!

            if (position && node.position && position !== node.position) {
              const {columns, ...d} = data
              nodesToUpdate.push({
                erdId,
                id,
                type,
                position: node.position!,
                data: d
              })
            }

            break
          case "remove":
            nodesToDelete.push(node.id)
            break

          default:
          // console.log(node)
        }
      })

      if (nodesToUpdate.length > 0) {
        erdApi.put(`/v1/erd/${erdId}/table/bulk`, {
          tableList: nodesToUpdate
        })
          .then(res => {
            console.log(res.status === httpStatus.OK ? `Nodes updated` : "Nodes created")
          })
      }

      nodesToDelete.forEach(nodeId => {
        erdApi.delete(`/v1/erd/${erdId}/table/${nodeId}`)
          .then(() => console.log(`Node deleted ${nodeId}`))
      })

      return ({nodes: applyNodeChanges(nodeChanges, oldNodes)})
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
            erdApi.delete(`/v1/erd/${cur.erdId}/relation/${edge.id}$}`)
            targetNode = cur.nodes.find(node => node.data.columns.map(column => column.id).includes(edge.id))

            if (targetNode) {
              targetNode.data.columns = targetNode.data.columns.filter(column => column.id !== edge.id)
              targetNode.updatedAt = new Date()
            }
            break
          case "reset":
            console.log("edge maybe added")
            break
          case "select":
            console.log("edge selected")
            break
        }
      })

      console.log(targetNode)
      return {
        edges: applyEdgeChanges(edgeChanges, cur.edges),
        nodes: cur.nodes.map(node => node.id === targetNode?.id ? targetNode : node)
      }
    })
  },
  reset: () => set(initialState)
}))
