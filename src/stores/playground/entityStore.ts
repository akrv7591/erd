import {StateCreator} from "zustand";
import {EntityNode, EntityNodeColumn, EntityNodeData} from "@/types/entity-node";
import {XYPosition} from "@xyflow/react";
import {ColumnEnum, EntityEnum, EntityViewMode} from "@/enums/playground.ts";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {createId} from "@paralleldrive/cuid2";
import voca, {Chain} from "voca";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {notifications} from "@mantine/notifications";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import { orderBy } from "lodash";

interface EntityStoreState {
  mode: EntityViewMode
}

interface EntityStoreAction {
  // Entity actions
  entityOnDragAdd: (position: XYPosition) => void
  onBeforeEntitiesDelete: (entities: EntityNode[]) => Promise<boolean>
  getEntity: (id: string) => EntityNode
  patchEntityData: (obj: {entityId: string, key: string, value: string}) => void
  setEntityData: (id: string, obj: Partial<EntityNodeData> | ((obj: EntityNodeData) => Partial<EntityNodeData>)) => void,

  // Entity column actions
  addColumn: (column: EntityNodeColumn) => void
  addDefaultColumn: (entityId: string, defaultData?: Partial<EntityNodeColumn>) => void
  addPrimaryColumn: (entityId: string) => void
  patchColumn: <K extends keyof EntityNodeColumn>(obj: {entityId: string, columnId: string, key: K, value: EntityNodeColumn[K]}) => void
  deleteColumn: (obj: {entityId: string, columnId: string[]}) => void
  removeColumn: (ids: EntityNodeColumn[]) => void

  // Utility actions
  setEntityViewMode: (mode: EntityViewMode) => void

  // Reset actions
  resetEntityStore: () => void
}

export type EntityStore = EntityStoreState & EntityStoreAction

const initialState: EntityStoreState = {
  mode: EntityViewMode.EDITOR
}

export const entityStore: StateCreator<PlaygroundStore, [], [], EntityStore> = ((set, get) => ({
  ...initialState,

  //Actions
  entityOnDragAdd: (position) => {
    const state = get()
    const id = createId();
    const columns: EntityNodeColumn[] = []
    let name: string | Chain

    switch (state.tableNameCase) {
      case "pascal":
        name = voca("table").titleCase()
        break
      case "camel":
        name = voca("table").capitalize()
        break
      case "snake":
        name = voca("table").capitalize()
        break
    }

    const data: EntityNodeData = ({
      name: String(name),
      color: "#006ab9",
      columns
    })

    const newNode = {
      id,
      type: NODE_TYPES.ENTITY,
      position,
      data: data,
    };

    const {handleEmitResponse, notifyErrorMessage, socket} = state.playground
    const entityAddResponseHandler = handleEmitResponse({
      onError: notifyErrorMessage(EntityEnum.add, "Failed to add Entity"),
      onSuccess: () => state.addNode(newNode)
    })
    socket.emit(EntityEnum.add, {entity: newNode}, entityAddResponseHandler)
  },

  onBeforeEntitiesDelete: (entities) => {
    return new Promise((resolve) => {
      const entityNames = entities.reduce((names, entity, i) => {
        if (i < entities.length - 1) {
          names += `${entity.data.name},`
        } else {
          names += `${entity.data.name}`
        }
        return names
      }, "")
      const entityName = entities.length > 1 ? "entities" : "entity"

      set(state => ({
        confirmModal: {
          ...state.confirmModal,
          opened: true,
          message: `Are you sure you want to delete ${entityNames} ${entityName}?`,
          onConfirm: (callback) => {
            const entityDeleteResponseHandler = state.playground.handleEmitResponse({
              onError: () => {
                notifications.show({
                  title: EntityEnum.delete,
                  message: "Failed to delete entity"
                })
                resolve(false)
              },
              onSuccess: () => {
                if (callback) {
                  callback()
                }
                resolve(true)
              }
            })
            state.playground.socket.emit(EntityEnum.delete, {entityId: entities.map(entity => entity.id)}, entityDeleteResponseHandler)
          },
          onCancel: (callback) => {
            resolve(false)
            if (callback) {
              callback()
            }
          }
        }
      }))
    })
  },
  setEntityViewMode: (mode) => set({mode}),
  resetEntityStore: () => set({...initialState, playground: undefined}),

  addColumn: (column) => {
    set(state => ({
      nodes: state.nodes.map(node => {
        if (node.id !== column.entityId) return node

        if (node.type !== NODE_TYPES.ENTITY) return node

        const data = node.data as EntityNodeData

        return {
          ...node,
          data: {
            ...data,
            columns: [...data.columns, column]
          }
        }
      })
    }))
  },

  getEntity: (id) => {
    return  get().nodes.find(node => node.id === id) as EntityNode
  },

  addDefaultColumn: (entityId, defaultData) => {
    const state = get()
    const {socket: io, handleEmitResponse, notifyErrorMessage} = state.playground
    const entity = state.getEntity(entityId)

    const column: EntityNodeColumn = {
      ...DEFAULT_COLUMN_DATA,
      ...defaultData,
      order: entity.data.columns.length,
      entityId,
      id: createId()
    }

    const columnAddResponse = handleEmitResponse({
      onError: notifyErrorMessage(ColumnEnum.add, "Failed to add column"),
      onSuccess: () => state.addColumn(column)
    })

    io.emit(ColumnEnum.add, {column}, columnAddResponse)
  },

  addPrimaryColumn: (entityId) => {
    const state = get()

    state.addDefaultColumn(entityId, {
      primary: true,
      unique: true,
      notNull: false,
    })
  },

  patchColumn: (obj) => set(state => ({
    nodes: state.nodes.map(node => {
      if (node.id !== obj.entityId) return node

      const nodeData = node.data as EntityNodeData

      const updatedColumns = nodeData.columns.map(column => {
        if (column.id !== obj.columnId) return column
        return {
          ...column,
          [obj.key]: obj.value
        }
      })

      return {
        ...node,
        data: {
          ...node.data,
          columns: obj.key === 'order'
            ? orderBy(updatedColumns, ['order'], ['asc'])
            : updatedColumns
        }
      }
    })
  })),
  deleteColumn: (obj) => {
    set(state => ({
      nodes: state.nodes.map(node => {

        if (node.id !== obj.entityId) {
          return node
        }
        const nodeData = node.data as EntityNodeData
        return {
          ...node,
          data: {
            ...nodeData,
            columns: nodeData.columns.filter(column => !obj.columnId.includes(column.id))
          }
        }
      })
    }))
  },
  patchEntityData(obj) {
    set(state => ({
      nodes: state.nodes.map(node => {

        if (node.id !== obj.entityId) {
          return node
        }

        return {
          ...node,
          data: {
            ...node.data,
            [obj.key]: obj.value
          }
        }
      })
    }))
  },

  setEntityData: (id, obj) => {
    const state = get()

    let data: Partial<EntityNodeData>

    if (typeof obj === "function") {
      const entity = state.getEntity(id)
      data = obj(entity.data)
    } else {
      data = obj
    }

    set(state => ({
      nodes: state.nodes.map(node => {
        if (node.id !== id) return node

        return {
          ...node,
          data: {
            ...node.data,
            ...data
          }
        }
      })
    }))

  },
  removeColumn: (columns) => {
    const nodeIds = columns.map(column => column.entityId)
    set(state => ({
      nodes: state.nodes.map(node => {

        if (!nodeIds.includes(node.id)) return node

        if (node.type !== NODE_TYPES.ENTITY) return node

        const columnIds = columns.filter(column => column.entityId === node.id).map(column => column.id)

        const data = node.data as EntityNodeData

        return {
          ...node,
          data: {
            ...data,
            columns: data.columns.filter(column => !columnIds.includes(column.id))
          }
        }
      })
    }))
  },
 }))
