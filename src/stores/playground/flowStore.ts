import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {StateCreator} from "zustand";
import {EntityNode} from "@/types/entity-node";
import {applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, NodeChange,} from "@xyflow/react";
import {ColumnEnum, EntityEnum, NodeEnum, RelationEnum} from "@/enums/playground.ts";
import {ConnectionData, CustomNodeTypes, NodeType} from "@/types/playground";
import {RELATION} from "@/constants/relations.ts";
import React from "react";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {MemoNode} from "@/types/memo-node";
import {makeNodeRedisKey} from "@/services/multiplayer/node-service.ts";


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
      const entityNodes = nodes.some(node => node.type! === NODE_TYPES.ENTITY)
      const memoNodes = nodes.some(node => node.type! === NODE_TYPES.MEMO)

      if (entityNodes && memoNodes) {
        result = await state.onBeforeDeleteSelected(nodes, edges)
      } else if (entityNodes) {
        result = await state.onBeforeEntitiesDelete(nodes as EntityNode[])
      } else if (memoNodes) {
        result = await state.onBeforeMemosDelete(nodes as MemoNode[])
      }
    } else if (edges.length) {
      // Edge deletion handler
      result = await state.onBeforeRelationsDelete(edges)
    }

    return result
  },

  onBeforeDeleteSelected: (nodes, edges) => new Promise((res) => {
    const entities = nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[]
    const memos = nodes.filter(node => node.type === NODE_TYPES.MEMO)

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
    console.log("NODE CHANGING: ", nodeChanges.length)
    set((state) => {
      const positionChanges: { [key: string]: string } = {}

      nodeChanges.forEach((node) => {
        switch (node.type) {
          case "position":
            positionChanges[makeNodeRedisKey(state.id, state.playground.nodesType.get(node.id)!, node.id)] = JSON.stringify(node.position)
        }
      })


      if (Object.keys(positionChanges).length) {
        state.playground.node(NodeEnum.patchPositions, positionChanges)
      }

      if (nodeChanges.some(node => node.type === "replace")) {
        console.log("REPLACING NODES HAPPENED")
      }

      const appliedNodeChanges = applyNodeChanges(nodeChanges, state.nodes)

      return {
        nodes: appliedNodeChanges,
      }
    })
  },

  setEdgeChanges: (edgeChanges) => {
    console.log("EDGE CHANGES RECREATED: ")
    set(cur => {
      let targetNode: undefined | EntityNode
      edgeChanges.forEach(edge => {
        switch (edge.type) {
          case "remove":
            const relation = cur.relations.find(r => r.id === edge.id)

            if (relation) {
              cur.playground.relation(RelationEnum.delete, [relation.id])
              targetNode = cur.nodes.find(entity => entity.id === relation.target) as EntityNode

              if (targetNode) {
                const columnIdsToDelete = targetNode.data.columns.filter(c => c.id === relation.id).map(column => column.id)

                // Emit foreign key columns delete event
                cur.playground.column(ColumnEnum.delete, columnIdsToDelete, targetNode.id)
              }
            }
        }
      })

      return {
        relations: applyEdgeChanges(edgeChanges, cur.relations),
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

    data.entities.forEach(entity => state.playground.entity(EntityEnum.add, entity))
    data.columns.forEach((column) => state.playground.column(ColumnEnum.add, column))
    data.relations.forEach(relation => state.playground.relation(RelationEnum.add, relation))

    return {tool: "hand-grab"}
  }),

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
  }
}))
