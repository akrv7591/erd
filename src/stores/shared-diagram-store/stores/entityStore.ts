import {StateCreator} from "zustand";
import {XYPosition} from "@xyflow/react";
import {SharedDiagramStore} from "../SharedDiagramStore.ts";
import {createId} from "@paralleldrive/cuid2";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import {EntityColumn, EntityData, EntityNode} from "@/providers/shared-diagram-store-provider/type.ts";

interface EntityStoreState {
}

interface EntityStoreAction {
  // Entity actions
  entityOnDragAdd: (position: XYPosition) => void
  onBeforeEntitiesDelete: (entities: EntityNode[]) => Promise<boolean>
  getEntity: (id: string) => EntityNode
  setEntityData: (id: string, obj: Partial<EntityData> | ((obj: EntityData) => Partial<EntityData>)) => void,

  // Entity column actions
  addColumn: (column: EntityColumn) => void
  addDefaultColumn: (entityId: string, defaultData?: Partial<EntityColumn>) => void
  addPrimaryColumn: (entityId: string) => void
  deleteColumns: (obj: { entityId: string, columnId: string[] }) => void
  getSelectedColumns: (entityId: string) => EntityColumn[]
  deleteSelectedColumns: (entityId: string) => void

  // Column actions
  getColumns: (entityId: string) => EntityColumn[]
  setColumnData: (entityId: string, columnId: string, obj: Partial<EntityColumn> | ((obj: EntityColumn) => Partial<EntityColumn>)) => void
}

export type EntityStore = EntityStoreState & EntityStoreAction

export const entityStore: StateCreator<SharedDiagramStore, [], [], EntityStore> = ((set, get) => ({
  //Actions
  entityOnDragAdd: (position) => {
    const id = createId();
    const name = "Table"
    const state = get()
    const node: EntityNode = {
      id,
      type: NODE_TYPES.ENTITY,
      position,
      data: {
        name,
        color: "#006ab9",
        columns: {}
      },
    };

    state.addNode(node)
  },

  onBeforeEntitiesDelete: (entities) => {
    return new Promise((resolve) => {
      const state = get()
      const entityNames = entities.reduce((names, entity, i) => {
        if (i < entities.length - 1) {
          names += `${entity.data.name},`
        } else {
          names += `${entity.data.name}`
        }
        return names
      }, "")
      const entityName = entities.length > 1 ? "entities" : "entity"

      state.setConfirmModal({
        opened: true,
        message: `Are you sure you want to delete ${entityNames} ${entityName}?`,
        onConfirm: (callback) => {
          if (callback) {
            callback()
          }
          resolve(true)
        },
        onCancel: (callback) => {
          resolve(false)

          if (callback) {
            callback()
          }
        }
      })
    })
  },

  getEntity: (id) => {
    const state = get()
    const entity = state.nodes[id]

    if (!entity || entity.type !== NODE_TYPES.ENTITY) {
      throw new Error("Not an entity")
    }

    return entity
  },

  addColumn: (column) => {
    set(state => {
      const nodeData = state.nodes[column.entityId].data as EntityData
      const updatedNodeDate = {
        ...nodeData,
        columns: {
          ...nodeData.columns,
          [column.id]: column
        }
      }

      const entity = state.nodes[column.entityId] as EntityNode

      return ({
        nodes: {
          ...state.nodes,
          [entity.id]: {
            ...entity,
            data: updatedNodeDate
          }
        }
      })
    })
  },

  addDefaultColumn: (entityId, defaultData) => {
    const state = get()
    const entity = state.getEntity(entityId)
    const order = Object.keys(entity.data.columns).length
    const id = createId()

    const column: EntityColumn = {
      ...DEFAULT_COLUMN_DATA,
      ...defaultData,
      id,
      order,
      entityId,
    }

    state.addColumn(column)
  },

  addPrimaryColumn: (entityId) => {
    const state = get()

    state.addDefaultColumn(entityId, {
      primary: true,
      unique: true,
      notNull: true,
    })
  },
  deleteColumns: (obj) => {
    set(state => {
      const entity = state.getEntity(obj.entityId)
      const updatedEdges = state.edges
      const entityData: EntityData = {
        ...entity.data,
        columns: Object.entries(entity.data.columns).reduce((updatedColumns, [id, column]) => {
          if (!obj.columnId.includes(id)) {
            updatedColumns[id] = column
          }

          if (column.foreignKey) {
            delete updatedColumns[id]
          }

          return updatedColumns
        }, {} as EntityData["columns"])
      }

      const updatedState: Partial<SharedDiagramStore> = {
        nodes: {
          ...state.nodes,
          [obj.entityId]: {
            ...entity,
            data: entityData
          }
        }
      }

      if (Object.keys(updatedEdges).length !== Object.keys(state.edges).length) {
        updatedState.edges = {
          ...updatedEdges
        }
      }

      return updatedState
    })
  },

  setEntityData: (id, obj) => {
    const state = get()

    let data: Partial<EntityData>
    const entity = state.getEntity(id)

    if (typeof obj === "function") {
      data = obj(entity.data)
    } else {
      data = obj
    }

    set(state => ({
      nodes: {
        ...state.nodes,
        [id]: {
          ...entity,
          data: {
            ...entity.data,
            ...data
          }
        }
      }
    }))

  },

  getSelectedColumns: (entityId) => {
    const state = get()

    return state.getColumns(entityId).filter(column => column.selected)
  },

  deleteSelectedColumns: (entityId) => {
    const state = get()

    const selectedColumns = state.getSelectedColumns(entityId)

    state.deleteColumns({
      entityId,
      columnId: selectedColumns.map(column => column.id)
    })
  },

  getColumns: (entityId) => {
    const state = get()
    const entity = state.getEntity(entityId)

    if (!entity) {
      console.log("Entity not found, probably deleted")
      return []
    }

    const unorderedColumns = Array.from(Object.values(entity.data.columns))


    // Returning an ordered columns
    return unorderedColumns.sort((a, b) => a.order - b.order)
  },

  setColumnData(entityId, columnId, obj) {
    set(state => {
      const entity = state.getEntity(entityId)

      if (!entity) {
        return {}
      }

      const column = entity.data.columns[columnId]

      if (!column) {
        return {}
      }

      const updatedColumn = {
        ...column,
        ...typeof obj === 'function' ? obj(column) : obj
      }

      const updatedEntity: EntityNode = {
        ...entity,
        data: {
          ...entity.data,
          columns: {
            ...entity.data.columns,
            [columnId]: updatedColumn
          }
        }
      }

      return {
        nodes: {
          ...state.nodes,
          [updatedEntity.id]: updatedEntity
        }
      }
    })
  }
}))
