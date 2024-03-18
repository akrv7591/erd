import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {StateCreator} from "zustand";
import {EntityNode} from "@/types/entity-node";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  OnBeforeDelete
} from "@xyflow/react";
import {ColumnEnum, EntityEnum, RelationEnum} from "@/enums/playground.ts";
import {CustomNodeTypes, IAddNodeProps, IConnectionData, NodeType} from "@/types/playground";
import {RELATION} from "@/constants/relations.ts";
import {MemoNode} from "@/stores/playground/memoStore.ts";
import React from "react";


interface FlowStoreState {
}

interface FlowStoreAction {
  getNodes: () => NodeType[]
  getEdges: () => Edge[]
  setNodeChanges: (nodeChanges: NodeChange<NodeType>[]) => void
  setEdgeChanges: (edgeChanges: EdgeChange[]) => void
  setConnection: (connection: Connection) => void
  onBeforeDelete: OnBeforeDelete<NodeType>
  nodeOnDragAdd: (props: IAddNodeProps) => React.DragEventHandler<HTMLDivElement>
}

export type FlowStore = FlowStoreState & FlowStoreAction

const initialState: FlowStoreState = {}

export const flowStore: StateCreator<UsePlaygroundStore, [], [], FlowStore> = ((set, get) => ({
  ...initialState,

  // Actions
  getNodes: () => {
    const state = get()
    let nodes: NodeType[] = [...state.entities]

      if (state.showMemos) {
        nodes = [...nodes, ...state.memos]
      }

    return nodes
  },
  getEdges: () => get().relations,

  onBeforeDelete: async ({nodes, edges}) => {
    if (!nodes.length) {
      // Edge deletion handler
      return new Promise((res) => {
        set({
          confirmModal: {
            ...get().confirmModal,
            opened: true,
            message: `Are you sure you want to delete ${edges.length} ${edges.length === 1 ? "edge" : "edges"} with relation columns?`,
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
        })
      })
    } else {
      // Node deletion handler
      return new Promise((res) => {
        set({
          confirmModal: {
            ...get().confirmModal,
            opened: true,
            message: `Are you sure you want to delete ${nodes.length} nodes and memos with relations?`,
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
        })
      })

    }
  },

  setNodeChanges: (nodeChanges) => {
    set((state) => {
      const entities: NodeChange<EntityNode>[] = []
      const memos: NodeChange<MemoNode>[] = []

      nodeChanges.forEach((node) => {
        let nodeType: CustomNodeTypes

        if (node.type !== "add") {
          nodeType = state.getNodes().find(n => n.id === node.id)!.type!
        } else {
          nodeType = node.item.type!
        }

        switch (nodeType) {
          case "entityNode":
            state.onEntityNodeChange(node as NodeChange<EntityNode>)
            entities.push(node as NodeChange<EntityNode>)
            break
          case "memoNode":
            state.onMemoNodeChange(node as NodeChange<MemoNode>)
            memos.push(node as NodeChange<MemoNode>)
            break
        }
      })

      return ({
        entities: applyNodeChanges(entities, state.entities),
        memos: applyNodeChanges(memos, state.memos)
      })
    })
  },

  setEdgeChanges: (edgeChanges) => {
    set(cur => {
      let targetNode: undefined | EntityNode
      edgeChanges.forEach(edge => {
        switch (edge.type) {
          case "add":
            break
          case "remove":
            const relation = cur.relations.find(r => r.id === edge.id)

            if (relation) {
              cur.playground.relation(RelationEnum.delete, relation)
              targetNode = cur.entities.find(entity => entity.id === relation.target)

              if (targetNode) {
                cur.playground.column(ColumnEnum.delete, targetNode.data.columns.find(c => c.id === relation.id)!)

                targetNode = {
                  ...targetNode,
                  data: {
                    ...targetNode.data,
                    columns: targetNode.data.columns = targetNode.data.columns.filter(c => c.id !== relation.id)
                  }
                }
              }
            }

            break
          case "replace":
            break
          case "select":
            break
        }
      })

      return {
        relations: applyEdgeChanges(edgeChanges, cur.relations),
        entities: cur.entities.map(node => node.id === targetNode?.id ? targetNode : node)
      }
    })
  },

  setConnection: (connection) => set(state => {

    const targetNode = state.entities.find(entity => entity.id === connection.target)!
    const sourceNode = state.entities.find(entity => entity.id === connection.source)!

    if (targetNode.id === sourceNode.id) return {tool: "hand-grab"}

    const data: IConnectionData = {
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

    data.entities.forEach(entity => state.playground.table(EntityEnum.add, entity))
    data.columns.forEach((column) => state.playground.column(ColumnEnum.add, column))
    data.relations.forEach(relation => state.playground.relation(RelationEnum.add, relation))

    return {tool: "hand-grab"}
  }),

  nodeOnDragAdd: ({reactFlowInstance}: IAddNodeProps) => (e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData('application/reactflow') as CustomNodeTypes;

    // @ts-ignore
    const targetIsPane = e.target.classList.contains('react-flow__pane');


    // check if the dropped element is valid
    if (!targetIsPane) return;
    if (typeof type === 'undefined' || !type) return

    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY
    })

    const state = get()

    switch (type) {
      case "entityNode":
        state.entityOnDragAdd(position)
        break
      case "memoNode":
        state.memoOnDragAdd(position)
    }
  }
}))
