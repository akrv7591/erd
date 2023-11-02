import {create} from "zustand";
import {IErdNode, IErdNodeColumn, IErdNodeData, ITools} from "../../types/erd-node";
import {v4} from "uuid";
import {Connection, Edge, Project} from "reactflow";
import voca from "voca";
import {RELATIONS} from "../../constants/relations";
import {useErdStore} from "../../stores/useErdStore";

interface IAddNodeProps {
  e: any
  reactFlowWrapper: any;
  project: Project
}

export interface IErdDiagramStore {
  erdUuid: string;
  tool: ITools;
  dragPane: boolean;
  nodes: IErdNode[];
  edges: Edge[];


  // Actions
  setNodes: (nodes: IErdNode[]) => void
  setEdges: (edges: Edge[]) => void
  setTool: (tool: ITools) => void
  addNode: (props: IAddNodeProps) => void
  deleteNode: (nodeId: string) => void
  setNodeData: (nodeId: string, data: IErdNodeData) => void
  setConnection: (connection: Connection) => void
  setDragPane: (dragPane: boolean) => void
  setErdUuid: (erdUuid: string) => void
  setState: (state: Partial<IErdDiagramStore>) => void
}

export const useErdDiagramStore = create<IErdDiagramStore>()((set) => ({
  erdUuid: "",
  tool: "grab",
  dragPane: true,
  nodes: [],
  edges: [],

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
      const id = v4();
      const columns: IErdNodeColumn[] = []
      const data: IErdNodeData = ({
        tableName: `table_${state.nodes.length}`,
        columns,
        color: "var(--mantine-color-dark-6)"
      })
      const newNode: IErdNode = {
        id,
        type: "tableNode",
        position: project({x: e.clientX - left - 75, y: e.clientY - top}),
        data: data
      };
      return {nodes: [...state.nodes, newNode], tool: "grab"}
    }

    return {tool: "grab"}
  }),
  deleteNode: (nodeId) => set(state => ({nodes: state.nodes.filter(node => node.id !== nodeId)})),
  setNodeData: (nodeId, data) => set(state => ({
    nodes: state.nodes.map(n => n.id !== nodeId ? n : ({
      ...n,
      data: data
    }))
  })),
  setConnection: (connection) => set(state => {
    const nodes = state.nodes
    const targetNode = nodes.find(node => node.id === connection.target)!
    const sourceNode = nodes.find(node => node.id === connection.source)!

    if (targetNode.id === sourceNode.id) return state

    const targetColumns = targetNode.data.columns
    const sourcePrimaryColumns = sourceNode.data.columns.filter(column => column.primary).map(column => ({
      ...column,
      tableName: sourceNode.data.tableName,
      id: v4(),
      tableId: sourceNode.id
    }))

    const newEdges: Edge[] = []
    const newNodes: IErdNode[] = []

    switch (state.tool) {
      case RELATIONS.ONE_TO_ONE:
        targetNode.data.columns = [...targetColumns, ...sourcePrimaryColumns.map(({tableName, tableId, ...column}) => {
          newEdges.push({
            source: sourceNode.id,
            target: targetNode.id,
            markerEnd: RELATIONS.ONE_TO_ONE,
            id: targetNode.id + column.id,
          })
          return {
            ...column,
            column: voca.snakeCase(sourceNode.data.tableName + voca.titleCase(column.column)),
            foreignKey: true,
            primary: false,
            autoIncrement: false,
            unique: true
          }
        })]
        break
      case RELATIONS.ONE_TO_MANY:
        targetNode.data.columns = [...targetColumns, ...sourcePrimaryColumns.map(({tableName, tableId, ...column}) => {
            newEdges.push({
              source: sourceNode.id,
              target: targetNode.id,
              markerEnd: RELATIONS.ONE_TO_MANY,
              id: targetNode.id + column.id
            })
            return {
              ...column,
              column: voca.snakeCase(sourceNode.data.tableName + voca.titleCase(column.column)),
              primary: false,
              foreignKey: true,
              unique: false,
              autoIncrement: false,
            }
          }
        )]
        break
      case RELATIONS.MANY_TO_MANY:
        const targetPrimaryColumns = targetNode.data.columns.filter(column => column.primary).map(column => ({
          ...column,
          tableName: targetNode.data.tableName,
          id: v4(),
          tableId: targetNode.id
        }))
        if (targetPrimaryColumns.length === 0) return state;
        const columnsCombined = [...targetPrimaryColumns, ...sourcePrimaryColumns]
        const id = v4();
        const columns = (columnsCombined.map(columnData => ({
          ...columnData,
          primary: false,
          foreignKey: true,
          unique: false,
          autoIncrement: false,
          column: voca.snakeCase(columnData.tableName + "_" + columnData.column)
        })))

        const dataAtom = {
          tableName: sourceNode.data.tableName + "_" + targetNode.data.tableName,
          columns,
          color: "var(--mantine-color-dark-6)"
        }
        const newNode: IErdNode = {
          id,
          type: "tableNode",
          position: {
            x: Math.abs(sourceNode.position.x - targetNode.position.x),
            y: Math.abs(sourceNode.position.y - targetNode.position.y)
          },
          data: dataAtom
        };

        newNodes.push(newNode)

        columnsCombined.forEach(column => {
          newEdges.push({
            source: column.tableId,
            target: id,
            markerEnd: RELATIONS.ONE_TO_MANY,
            id: id + column.id
          })
        })
    }

    return {...state, edges: [...state.edges, ...newEdges], nodes: [...state.nodes, ...newNodes], tool: "grab"}
  }),
  setDragPane: (dragPane: boolean) => set({dragPane}),
  setErdUuid: (erdUuid) => set({erdUuid}),
  setState: (state) => set(state)
}))

useErdDiagramStore.subscribe(state => {

  if (!state.erdUuid) return
  useErdStore.setState(erdState => ({
    ...erdState, erds: erdState.erds.map(erd => {

      if (state.erdUuid !== erd.id) return erd

      return {
        ...erd,
        nodes: state.nodes,
        edges: state.edges
      }
    })
  }))
})
