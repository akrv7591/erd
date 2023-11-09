import {create} from "zustand";
import {IErdNode, IErdNodeColumn, IErdNodeData, ITools} from "../../types/erd-node";
import {v4} from "uuid";
import {applyNodeChanges, Connection, Edge, Node, NodeChange, Project} from "reactflow";
import voca from "voca";
import {RELATIONS} from "../../constants/relations";
import {useErdStore} from "../../stores/useErdStore";
import {ITable} from "../../types/data/table";
import erdApi from "../../api/erdApi.tsx";
import {createId} from "@paralleldrive/cuid2";

interface IAddNodeProps {
  e: any
  reactFlowWrapper: any;
  project: Project
}

export interface IErdDiagramStore {
  erdId: string;
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
  setConnection: (connection: Connection) => void
  setDragPane: (dragPane: boolean) => void
  setErdId: (erdId: string) => void
  setState: (state: Partial<IErdDiagramStore>) => void
  setNodeChanges: (nodeChanges: NodeChange[]) => void
}

export const useErdDiagramStore = create<IErdDiagramStore>()((set) => ({
  erdId: "",
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
      return {nodes: [...state.nodes, newNode], tool: "grab"} as Partial<IErdDiagramStore>
    }

    return {tool: "grab"}
  }),
  deleteNode: (nodeId) => set(state => ({nodes: state.nodes.filter(node => node.id !== nodeId)})),
  setConnection: (connection) => set(state => {
    const nodes = state.nodes
    const targetNode = nodes.find(node => node.id === connection.target)!
    const sourceNode = nodes.find(node => node.id === connection.source)!

    if (targetNode.id === sourceNode.id) return state

    const targetColumns = targetNode.data.columns
    const sourcePrimaryColumns = sourceNode.data.columns.filter(column => column.primary).map(column => ({
      ...column,
      tableName: sourceNode.data.name,
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
            name: voca.snakeCase(sourceNode.data.name + voca.titleCase(column.name)),
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
              name: voca.snakeCase(sourceNode.data.name + voca.titleCase(column.name)),
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
          tableName: targetNode.data.name,
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
          name: voca.snakeCase(columnData.tableName + "_" + columnData.name)
        })))

        const data: IErdNodeData = {
          name: sourceNode.data.name + "_" + targetNode.data.name,
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
          data: data
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
  setErdId: (erdId) => set({erdId}),
  setState: (state) => set(state),
  setNodeChanges: (nodeChanges: NodeChange[]) => {
    set(({nodes: oldNodes, erdId}) => {
        const nodesToUpdate: any[] = []
        nodeChanges.forEach((node) => {
          // @ts-ignore
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

            default:
              // console.log(node)
          }
        })

      if (nodesToUpdate.length > 0) {
        erdApi.put(`/v1/erd/${erdId}/table/bulk`, {
          tableList: nodesToUpdate
        })
          .then(res => {
            console.log(res.status)
          })
      }

      return ({nodes: applyNodeChanges(nodeChanges, oldNodes)})
    })
  }
}))

useErdDiagramStore.subscribe((state, prevState) => {

  // console.log(state)
})
