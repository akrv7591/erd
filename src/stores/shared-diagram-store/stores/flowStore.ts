import {SharedDiagramStore} from "../SharedDiagramStore.ts";
import {StateCreator} from "zustand";
import {
  applyEdgeChanges,
  Connection,
  Edge,
  EdgeChange,
  ReactFlowInstance, ReactFlowProps,
} from "@xyflow/react";
import {ConnectionData} from "@/types/playground";
import {RELATION} from "@/constants/relations.ts";
import React from "react";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {MemoNode} from "@/types/memo-node";
import {ConfirmModal} from "@/stores/diagram-store/stores/pane-store/PaneStore.ts";
import {objValuesToArray} from "@/utility/ObjectUtils.ts";
import {EntityData, EntityNode, NodeType} from "@/providers/shared-diagram-store-provider/type.ts";

interface FlowStoreState {
  nodes: Record<string, NodeType>
  edges: Record<string, Edge>
}

interface FlowStoreAction {
  handleEdgeChanges: (edgeChanges: EdgeChange[]) => void
  handleNodesDelete: ReactFlowProps['onNodesDelete']
  setConnection: (connection: Connection) => void
  handleOnBeforeDelete: ReactFlowProps<NodeType>['onBeforeDelete']
  nodeOnDragAdd: React.DragEventHandler<HTMLDivElement>
  onBeforeDeleteSelected: (nodes: NodeType[], edges: Edge[]) => Promise<boolean>
  addNode: (node: NodeType) => void
  deleteNode: (id: string[]) => void
  addEdge: (edge: Edge) => void
  deleteEdge: (id: string[]) => void
  setConfirmModal: (confirmModal: Partial<ConfirmModal> | ((confirmModal: ConfirmModal) => Partial<ConfirmModal>)) => void
  getReactFlow: () => ReactFlowInstance
  setNodePositions: (data: string[]) => void
}

export type FlowStore = FlowStoreState & FlowStoreAction

const initialState: FlowStoreState = {
  nodes: {},
  edges: {}
}

export const flowStore: StateCreator<SharedDiagramStore, [], [], FlowStore> = ((set, get) => ({
  ...initialState,

  handleOnBeforeDelete: async ({nodes, edges}) => {
    if (!nodes.length && !edges.length) {
      return false
    }

    let result: boolean = false

    const state = get()

    if (nodes.length) {
      // Node deletion handler
      const entityNodes = nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[]
      const memoNodes = nodes.filter(node => node.type === NODE_TYPES.MEMO) as MemoNode[]

      if (entityNodes.length && memoNodes.length) {
        result = await state.onBeforeDeleteSelected(nodes as NodeType[], edges)
      } else if (entityNodes.length) {
        result = await state.onBeforeEntitiesDelete(entityNodes)
      } else if (memoNodes.length) {
        result = await state.onBeforeMemosDelete(memoNodes)
      }
    } else if (edges.length) {
      // Edge deletion handler
      result = await state.onBeforeRelationsDelete(edges)
    }

    return result
  },

  onBeforeDeleteSelected: (nodes, edges) => new Promise((res) => {
    const entities = nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[]
    const memos = nodes.filter(node => node.type === NODE_TYPES.MEMO) as MemoNode[]

    let message = `Are you sure you want to delete `

    if (entities.length) {
      const entityMessage = entities.reduce((names, entity, i) => {
        if (i === entities.length - 1) {
          names += `and ${entity.data.name}`
        } else {
          names += `${entity.data.name}, `
        }
        return names

      }, "")

      message += entityMessage
    }

    if (memos.length) {
      message += ` and ${memos.length} ${memos.length > 1 ? "memos" : "memo"}`
    }

    if (edges.length) {
      message += ` and ${edges.length} ${edges.length > 1 ? "relations" : "relation"}?`
    }

    const state = get()

    state.setConfirmModal(
      {
        opened: true,
        message,
        onConfirm: (callback) => {
          res(true)
          if (callback) {
            callback()
          }
        },
        onCancel: (callback) => {
          res(false)
          if (callback) {
            callback()
          }
        }
      }
    )
  }),

  handleEdgeChanges: (edgeChanges) => {
    set(state => {
      const updatedEdges = applyEdgeChanges(edgeChanges, objValuesToArray(state.edges))

      const updates: Partial<SharedDiagramStore> = {
        edges: Object.fromEntries(updatedEdges.map(edge => [edge.id, edge]))
      }

      edgeChanges.forEach(edge => {
        switch (edge.type) {
          case "remove":
            const relation = state.edges[edge.id]

            if (!relation) {
              return;
            }

            const node = state.nodes[relation.target] as EntityNode

            if (!node) {
              return;
            }

            const nodeData = node.data as EntityData
            const updatedNodeColumns = Object.fromEntries(Object.entries(nodeData.columns).filter(([_, value]) => value.id !== relation.id))

            const updatedNode: EntityNode = {
              ...node,
              data: {
                ...nodeData,
                columns: updatedNodeColumns
              }
            }

            updates.nodes = {
              ...state.nodes,
              [updatedNode.id]: updatedNode
            }
        }
      })


      return updates
    })
  },

  setConnection: (connection) => set(state => {

    const targetNode = state.nodes[connection.target] as EntityNode
    const sourceNode = state.nodes[connection.source] as EntityNode

    const diagramStore = state.getStore()

    const setHandleToHandGrab = () => {
      diagramStore.setState({
        tool: "hand-grab"
      })
    }

    if (targetNode.id === sourceNode.id) {
      setHandleToHandGrab()
      return {}
    }

    const data: ConnectionData = {
      relations: [],
      columns: [],
      entities: []
    }


    switch (diagramStore.getState().tool) {
      case RELATION.NAME.ONE_TO_ONE:
        state.addOneToOneRelations(sourceNode, targetNode, data)
        break
      case RELATION.NAME.ONE_TO_MANY:
        state.addOneToManyRelations(sourceNode, targetNode, data)
        break
      case RELATION.NAME.MANY_TO_MANY:
        state.addManyToManyRelations(sourceNode, targetNode, data)
        break
    }

    const stateToUpdate: Partial<SharedDiagramStore> = {}

    if (data.relations.length) {
      stateToUpdate.edges = {
        ...state.edges,
        ...Object.fromEntries(data.relations.map(relation => [relation.id, relation]))
      }
    }

    if (data.entities.length) {
      stateToUpdate.nodes = {
        ...state.nodes,
        ...Object.fromEntries(data.entities.map(entity => [entity.id, entity]))
      }
    }

    setHandleToHandGrab()

    return stateToUpdate
  }),


  nodeOnDragAdd: (e) => {
    e.preventDefault();
    const state = get()


    const type = e.dataTransfer.getData('application/reactflow') as NODE_TYPES;

    // @ts-ignore
    const targetIsPane = e.target.classList.contains('react-flow__pane');


    // check if the dropped element is valid
    if (!targetIsPane) {
      console.warn("Dropped element is not in reactflow pane");
      return;
    }
    ;

    if (typeof type === 'undefined' || !type) {
      console.warn("Dropped element is not a valid reactflow node");
      return;
    }

    const position = state.getReactFlow().screenToFlowPosition({
      x: e.clientX,
      y: e.clientY
    })

    switch (type) {
      case NODE_TYPES.ENTITY:
        state.entityOnDragAdd(position)
        break
      case NODE_TYPES.MEMO:
        state.memoOnDragAdd(position)
    }
  },

  addNode: (node) => {
    set(state => ({
      nodes: {
        ...state.nodes,
        [node.id]: node
      }
    }))
  },

  deleteNode: (ids) => {
    const state = get()

    state.getReactFlow().deleteElements({
      nodes: ids.map(id => ({id})),
    })
  },

  addEdge: (edge) => {
    const state = get()
    state.getReactFlow().addEdges([edge])
  },
  deleteEdge: (ids) => {
    const state = get()
    state.getReactFlow().deleteElements({
      edges: ids.map(id => ({id})),
    })
  },
  // Util

  setConfirmModal: (confirmModal) => {
    const {getStore} = get()

    getStore().setState(state => ({
      confirmModal: {
        ...state.confirmModal,
        ...typeof confirmModal === "function" ? confirmModal(state.confirmModal) : confirmModal
      }
    }))
  },

  setNodePositions: (positionChanges) => {
    set(state => {
      const positionChangesObj: Record<string, NodeType> = {}

      positionChanges.forEach(positionChange => {
        const [id, x, y] = positionChange.split("|") as [string, string, string]
        const xNumber = Number(x)
        const yNumber = Number(y)

        if (Number.isNaN(xNumber) || Number.isNaN(yNumber)) {
          return
        }

        const node = state.nodes[id] as NodeType

        if (!node) {
          return
        }

        positionChangesObj[id] = {
          ...node,
          position: {x: xNumber, y: yNumber}
        }
      })

      return {
        nodes: {
          ...state.nodes,
          ...positionChangesObj
        }
      }
    })
  },

  handleNodesDelete: (deletedNodes) => {
    set(state => {
      const nodes = {
        ...state.nodes
      }

      deletedNodes.forEach(node => delete nodes[node.id])

      return {
        nodes
      }
    })
  },
  getReactFlow: () => get().getStore().getState().reactflow
}))
