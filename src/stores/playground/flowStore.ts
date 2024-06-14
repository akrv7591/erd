import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {StateCreator} from "zustand";
import {EntityNode} from "@/types/entity-node";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";
import {ColumnEnum, EntityEnum, NodeEnum, RelationEnum} from "@/enums/playground.ts";
import {ConnectionData, CustomNodeTypes, NodeType} from "@/types/playground";
import {RELATION} from "@/constants/relations.ts";
import React from "react";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {MemoNode} from "@/types/memo-node";
import { NodePatchPositionEmmitData } from "@/services/multiplayer/type";

interface FlowStoreState {
  nodes: NodeType[]
}

interface FlowStoreAction {
  setNodeChanges: (nodeChanges: NodeChange<NodeType>[]) => void
  setEdgeChanges: (edgeChanges: EdgeChange[]) => void
  setConnection: (connection: Connection) => void
  onBeforeDelete: (state: PlaygroundStore, nodes: NodeType[], edges: Edge[]) => Promise<boolean>
  nodeOnDragAdd: React.DragEventHandler<HTMLDivElement>
  onBeforeDeleteSelected: (nodes: NodeType[], edges: Edge[]) => Promise<boolean>
  addNode: (node: NodeType) => void
  deleteNode: (id: string[]) => void
  addEdge: (edge: Edge) => void
  deleteEdge: (id: string[]) => void
  emmitConnection: (data: ConnectionData) => Promise<void>

  // Utility actions
  getNodePositionChanges: (nodes: NodeChange<NodeType>[]) => NodePatchPositionEmmitData
}

export type FlowStore = FlowStoreState & FlowStoreAction

const initialState: FlowStoreState = {
  nodes: []
}

export const flowStore: StateCreator<PlaygroundStore, [], [], FlowStore> = ((set, get) => ({
  ...initialState,

  onBeforeDelete: async (state, nodes, edges) => {
    if (!nodes.length && !edges.length) {
      return false
    }

    let result: boolean = false

    if (nodes.length) {
      // Node deletion handler
      const entityNodes = nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[]
      const memoNodes = nodes.filter(node => node.type === NODE_TYPES.MEMO) as MemoNode[]

      if (entityNodes.length && memoNodes.length) {
        result = await state.onBeforeDeleteSelected(nodes, edges)
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

    set(state => ({
      confirmModal: {
        ...state.confirmModal,
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
    }))
  }),


  setNodeChanges: (nodeChanges) => {
    set((state) => {
      const {socket, notifyErrorMessage} = state.playground
      const nodePositionChanges = state.getNodePositionChanges(nodeChanges)

      if (nodePositionChanges.length) {
        const nodePatchPositionResponseHandler = state.playground.handleEmitResponse({
          onError: notifyErrorMessage(NodeEnum.patchPositions, "Failed to patch node positions"),
          // We are not setting node positions on success beacuse it makes lag if we wait for success message
          onSuccess: () => {}
        })

        socket.emit(NodeEnum.patchPositions, nodePositionChanges, nodePatchPositionResponseHandler)
      }

      // We are directly applying node changes
      // Because it makes lag feeling
      // If there are errors on on sending positionPatch there will be alert
      const appliedNodeChanges = applyNodeChanges(nodeChanges, state.nodes)

      return {
        nodes: appliedNodeChanges,
      }
    })
  },

  setEdgeChanges: (edgeChanges) => {
    console.log("EDGE CHANGES RECREATED: ")
    set(state => {
      const {socket, notifyErrorMessage} = state.playground
      let targetNode: undefined | EntityNode
      edgeChanges.forEach(edge => {
        switch (edge.type) {
          case "remove":
            const relation = state.relations.find(r => r.id === edge.id)

            if (relation) {
              const relationDeleteResponse = state.playground.handleEmitResponse({
                onError: notifyErrorMessage(RelationEnum.delete, "Failed to delete relation"),
                onSuccess: () => state.deleteEdge([relation.id])
              })

              socket.emit(RelationEnum.delete, {relationId: [relation.id]}, relationDeleteResponse)
              targetNode = state.nodes.find(entity => entity.id === relation.target) as EntityNode

              if (targetNode) {
                const columnIdsToDelete = targetNode.data.columns.filter(c => c.id === relation.id)

                // Emit foreign key columns delete event
                const columnDeleteResponse = state.playground.handleEmitResponse({
                  onError: notifyErrorMessage(ColumnEnum.delete, "Failed to delete column"),
                  onSuccess: () => state.removeColumn(columnIdsToDelete)
                })

                const columnIds = columnIdsToDelete.map(c => c.id)

                socket.emit(ColumnEnum.delete, {columnId: columnIds, entityId: targetNode.id}, columnDeleteResponse)
              }
            }
        }
      })

      return {
        relations: applyEdgeChanges(edgeChanges, state.relations),
      }
    })
  },

  setConnection: (connection) => set(state => {

    const targetNode = state.nodes.find(entity => entity.id === connection.target)! as EntityNode
    const sourceNode = state.nodes.find(entity => entity.id === connection.source)! as EntityNode

    if (targetNode.id === sourceNode.id) return {tool: "hand-grab"}

    const data: ConnectionData = {
      relations: [],
      columns: [],
      entities: []
    }

    switch (state.tool) {
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

    state.emmitConnection(data)

    return {tool: "hand-grab"}
  }),

  emmitConnection: async (data) => {
    const {playground, addRelation, addNode, addColumn} = get()
    const {notifyErrorMessage, handleEmitResponse, socket} = playground

    await Promise.all(data.entities.map(entity => new Promise(resolve => {
      const entityAddResponse = handleEmitResponse({
        onError: notifyErrorMessage(EntityEnum.add, "Failed to add entity"),
        onSuccess: () => {
          addNode(entity)
        },
      }, resolve)

      socket.emit(EntityEnum.add, {entity}, entityAddResponse)
    })))

    await Promise.all(data.columns.map((column) => new Promise(resolve => {
      const columnAddResponse = handleEmitResponse({
        onError: notifyErrorMessage(ColumnEnum.add, "Failed to add column"),
        onSuccess: () => {
          addColumn(column)
        }
      }, resolve)

      socket.emit(ColumnEnum.add, {column}, columnAddResponse)
    })))

    data.relations.forEach(relation => {
      addRelation(relation)
    })
  },

  nodeOnDragAdd: (e) => {
    console.log("RECREATING NODE ON DRAG ADD")
    e.preventDefault();
    const state = get()


    const type = e.dataTransfer.getData('application/reactflow') as CustomNodeTypes;

    // @ts-ignore
    const targetIsPane = e.target.classList.contains('react-flow__pane');


    // check if the dropped element is valid
    if (!targetIsPane) return;
    if (typeof type === 'undefined' || !type) return

    const position = state.playground.reactFlow.screenToFlowPosition({
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

  getNodePositionChanges(nodes) {
    const {playground} = get()
    const positionChanges: NodePatchPositionEmmitData = []

    nodes.forEach((node) => {
      switch(node.type) {
        case "position":
        const nodeType = playground.reactFlow.getNode(node.id)?.type

        if (!nodeType) {
          break
        }

        if (!node.position) {
          break
        }

        positionChanges.push({
          nodeId: node.id,
          position: node.position,
          type: nodeType as NODE_TYPES
        })
      }
    })

    return positionChanges
  },

  addNode: (node) => {
    set(state => ({nodes: [...state.nodes, node]}))
  },
  deleteNode: (ids) => {
    set(state => ({nodes: state.nodes.filter(node => !ids.includes(node.id))}))
  },
  addEdge: (edge) => {
    set(state => ({relations: [...state.relations, edge]}))
  },
  deleteEdge: (ids) => {
    set(state => ({relations: state.relations.filter(edge => !ids.includes(edge.id))}))
  },
}))
