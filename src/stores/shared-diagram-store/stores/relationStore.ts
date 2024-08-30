import {Edge} from "@xyflow/react";
import {StateCreator} from "zustand";
import {SharedDiagramStore} from "../SharedDiagramStore.ts";
import {ConnectionData} from "@/types/playground";
import {createId} from "@paralleldrive/cuid2";
import {RELATION} from "@/constants/relations.ts";
import voca from "voca";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {EntityColumn, EntityNode} from "@/providers/shared-diagram-store-provider/type.ts";


interface RelationStoreState {}

interface RelationStoreAction {
  addOneToOneRelations: (sourceNode: EntityNode, targetNode: EntityNode, data: ConnectionData) => void
  addOneToManyRelations: (sourceNode: EntityNode, targetNode: EntityNode, data: ConnectionData) => void
  addManyToManyRelations: (sourceNode: EntityNode, targetNode: EntityNode, data: ConnectionData) => void
  onBeforeRelationsDelete: (relations: Edge[]) => Promise<boolean>
}

export type RelationStore = RelationStoreState & RelationStoreAction


export const relationStore: StateCreator<SharedDiagramStore, [], [], RelationStore> = ((_, get) => ({
  addOneToOneRelations: (sourceNode, targetNode, data) => {
    const state = get()
    const sourceColumns = state.getColumns(sourceNode.id)
    const targetColumns = state.getColumns(targetNode.id)
    const sourcePrimaryKeys = sourceColumns.filter(column => column.primary)
    const sourceTableName = sourceNode.data.name
    const maxOrder = Math.max(...targetColumns.map(column => column.order)) + 1

    sourcePrimaryKeys.forEach((column, i) => {
      const id = createId()
      const foreignKeyRelation: Edge = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATION.NAME.ONE_TO_ONE,
      }
      const foreignKeyColumn: EntityColumn = {
        ...column,
        id,
        entityId: targetNode.id,
        name: voca.snakeCase(sourceTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        order: maxOrder + i,
        autoIncrement: false,
        unique: true,
      }

      data.relations.push(foreignKeyRelation)
      state.addColumn(foreignKeyColumn)
    })
  },

  addOneToManyRelations: (sourceNode, targetNode, data) => {
    const state = get()
    const sourceColumns = state.getColumns(sourceNode.id)
    const targetColumns = state.getColumns(targetNode.id)
    const sourceTablePrimaryKeys = sourceColumns.filter(column => column.primary)
    const sourceTableName = sourceNode.data.name
    const maxOrder = Math.max(...targetColumns.map(column => column.order)) + 1

    sourceTablePrimaryKeys.map((column, i) => {
      const id = createId()
      const foreignKeyRelation: Edge = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATION.NAME.ONE_TO_MANY,
      }
      data.relations.push(foreignKeyRelation)

      state.addColumn({
          ...column,
          id,
          entityId: targetNode.id,
          name: voca.snakeCase(sourceTableName + voca.titleCase(column.name)),
          foreignKey: true,
          order: maxOrder + i,
          primary: false,
          autoIncrement: false,
          unique: false
      })
    })
  },

  addManyToManyRelations: (sourceNode, targetNode, data) => {
    const entityName = sourceNode.data.name + targetNode.data.name

    const mnTable: EntityNode = {
      id: createId(),
      type: NODE_TYPES.ENTITY,
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2
      },
      data: {
        name: entityName,
        color: "#006ab9",
        columns: {},
      }
    }


    let order = 0

    function populateColumnsAndEdges(column: EntityColumn, tableName: string, nodeId: string) {
      const id = createId()

      data.relations.push({
        id,
        source: nodeId,
        target: mnTable.id,
        markerEnd: RELATION.NAME.ONE_TO_MANY,
      })

      mnTable.data.columns[column.id] = {
        ...column,
        entityId: mnTable.id,
        id,
        name: voca.snakeCase(tableName + voca.titleCase(column.name)),
        order,
        foreignKey: true,
        primary: true,
        unique: false
      }

      order++
    }
    const state = get()
    const sourceColumns = state.getColumns(sourceNode.id)
    const targetColumns = state.getColumns(targetNode.id)

    sourceColumns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, sourceNode.data.name, sourceNode.id))
    targetColumns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, targetNode.data.name, targetNode.id))

    data.entities.push(mnTable)
  },

  onBeforeRelationsDelete: (relations) => new Promise((res) => {
    const state = get()

    state.setConfirmModal(
      {
        opened: true,
        message: `Are you sure you want to delete ${relations.length} ${relations.length > 1 ? "relations" : "relation"} with relation columns?`,
        onConfirm: (callback) => {
          if (callback) {
            callback()
          }
          res(true)
        },
        onCancel: (callback) => {
          if (callback) {
            callback()
          }
          res(false)
        }
      }
    )
  }),
}))
