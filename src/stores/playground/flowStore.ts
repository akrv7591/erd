import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {StateCreator} from "zustand";
import {EntityNode, NodeType} from "@/types/entity-node";
import {applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, NodeChange} from "@xyflow/react";
import {Column, Entity, Relation} from "@/enums/playground.ts";
import {IConnectionData} from "@/types/playground";
import {RELATION} from "@/constants/relations.ts";

interface FlowStoreState {}

interface FlowStoreAction {
  getNodes: () => EntityNode[]
  getEdges: () => Edge[]
  setNodeChanges: (nodeChanges: NodeChange<NodeType>[]) => void
  setEdgeChanges: (edgeChanges: EdgeChange[]) => void
  setConnection: (connection: Connection) => void
}

export type FlowStore = FlowStoreState & FlowStoreAction

const initialState: FlowStoreState = {}

export const flowStore: StateCreator<UsePlaygroundStore, [], [], FlowStore> = ((set, get) => ({
  ...initialState,

  // Actions
  getNodes: () => get().entities,
  getEdges: () => get().relations,

  setNodeChanges: (nodeChanges) => {
    set((state) => {
      const nodesToUpdate: any[] = []
      const nodesToDelete: string[] = []
      nodeChanges.forEach((node) => {
        switch (node.type) {
          case "add":
            break
          case "replace":
            nodesToUpdate.push({
              erdId: state.id,
              id: node.item.id,
              type: node.item.type,
              position: node.item.position,
            })
            break
          case "position":
            const {id, type, position} = state.entities.find(oldNode => oldNode.id === node.id)!

            if (position && node.position && position !== node.position) {
              nodesToUpdate.push({
                erdId: state.id,
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

      nodesToUpdate.forEach(node => state.playground.table(Entity.update, node))

      nodesToDelete.forEach(nodeId => state.playground.table(Entity.delete, nodeId))

      return ({entities: applyNodeChanges<NodeType>(nodeChanges, state.entities)})
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
              cur.playground.relation(Relation.delete, relation)
              targetNode = cur.entities.find(entity => entity.id === relation.target)

              if (targetNode) {
                cur.playground.column(Column.delete, targetNode.data.columns.find(c => c.id === relation.id)!)

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

    data.entities.forEach(entity => state.playground.table(Entity.add, entity))
    data.columns.forEach((column) => state.playground.column(Column.add, column))
    data.relations.forEach(relation => state.playground.relation(Relation.add, relation))

    return {tool: "hand-grab"}
  })

}))
