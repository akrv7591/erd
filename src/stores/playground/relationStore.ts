import {Edge} from "@xyflow/react";
import {StateCreator} from "zustand";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ConnectionData, HighlightedRelation} from "@/types/playground";
import {createId} from "@paralleldrive/cuid2";
import {ICRelation} from "@/types/data/db-model-interfaces";
import {RELATION} from "@/constants/relations.ts";
import {EntityNode, EntityNodeColumn} from "@/types/entity-node";
import voca from "voca";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {RelationEnum} from "@/enums/playground.ts";


interface RelationStoreState {
  relations: Edge[];
  highlightedRelation: null | HighlightedRelation;
}

interface RelationStoreAction {
  setHighlightedRelation: (highlightedRelation: null | HighlightedRelation) => void
  resetRelationStore: () => void
  addOneToOneRelations: (sourceNode: EntityNode, targetNode: EntityNode, data: ConnectionData) => void
  addOneToManyRelations: (sourceNode: EntityNode, targetNode: EntityNode, data: ConnectionData) => void
  addManyToManyRelations: (sourceNode: EntityNode, targetNode: EntityNode, data: ConnectionData) => void
  onBeforeRelationsDelete: (relations: Edge[]) => Promise<boolean>
}

export type RelationStore = RelationStoreState & RelationStoreAction

const initialStore: RelationStoreState = {
  relations: [],
  highlightedRelation: null,
}

export const relationStore: StateCreator<UsePlaygroundStore, [], [], RelationStore> = ((set, get) => ({
  ...initialStore,

  setHighlightedRelation: (highlightedRelation) => set({highlightedRelation}),

  addOneToOneRelations: (sourceNode, targetNode, data) => {
    const state = get()
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name
    const maxOrder = Math.max(...targetNode.data.columns.map(column => column.order)) + 1

    foreignKeys.forEach((column, i) => {
      const id = createId()
      const relation: ICRelation = {
        id,
        erdId: state.id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATION.NAME.ONE_TO_ONE,
      }
      const newColumn: EntityNodeColumn = {
        ...column,
        id,
        entityId: targetNode.id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        order: maxOrder + i,
        autoIncrement: false,
        unique: true,
      }
      data.relations.push(relation)
      data.columns.push(newColumn)
    })
  },
  addOneToManyRelations: (sourceNode, targetNode, data) => {
    const state = get()
    const foreignKeys = sourceNode.data.columns.filter(column => column.primary)
    const foreignTableName = sourceNode.data.name
    const maxOrder = Math.max(...targetNode.data.columns.map(column => column.order)) + 1

    foreignKeys.map((column, i) => {
      const id = createId()
      const relation: ICRelation = {
        id,
        erdId: state.id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATION.NAME.ONE_TO_MANY,
      }
      data.relations.push(relation)
      data.columns.push({
        ...column,
        id,
        entityId: targetNode.id,
        name: voca.snakeCase(foreignTableName + voca.titleCase(column.name)),
        foreignKey: true,
        order: maxOrder + i,
        primary: false,
        autoIncrement: false,
        unique: false
      })
    })
  },
  addManyToManyRelations: (sourceNode, targetNode, data) => {
    const state = get()

    const mnTable: EntityNode = {
      id: createId(),
      type: NODE_TYPES.ENTITY,
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

    function populateColumnsAndEdges(column: EntityNodeColumn, tableName: string, nodeId: string) {
      const id = createId()
      const relation: ICRelation = {
        id,
        erdId: state.id,
        source: nodeId,
        target: mnTable.id,
        markerEnd: RELATION.NAME.ONE_TO_MANY,
      }
      data.relations.push(relation)
      mnTable.data.columns.push({
        ...column,
        entityId: mnTable.id,
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

    data.entities.push(mnTable)

  },

  onBeforeRelationsDelete: (relations) => new Promise((res) => {
    const state = get()
    set({
      confirmModal: {
        ...state.confirmModal,
        opened: true,
        message: `Are you sure you want to delete ${relations.length} ${relations.length > 1 ? "relations" : "relation"} with relation columns?`,
        onConfirm: (callback) => {
          state.playground.relation(RelationEnum.delete, relations.map(relation => relation.id))
          if (callback) {
            callback()
          }
          res(true)
        },
        onCancel: (callback) => {
          res(false)
          if (callback) {
            callback()
          }
        }
      }
    })
  }),
  resetRelationStore: () => set(initialStore)
}))
