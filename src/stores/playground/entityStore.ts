import {StateCreator} from "zustand";
import {EntityNode, EntityNodeColumn, EntityNodeData} from "@/types/entity-node";
import {NodeChange, XYPosition} from "@xyflow/react";
import {EntityEnum, EntityViewMode} from "@/enums/playground.ts";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {createId} from "@paralleldrive/cuid2";
import voca, {Chain} from "voca";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

interface EntityStoreState {
  entities: EntityNode[]
  mode: EntityViewMode
}

interface EntityStoreAction {
  entityOnDragAdd: (position: XYPosition) => void
  resetEntityStore: () => void
  onEntityNodeChange: (node: NodeChange<EntityNode>) => void
  onEntityNodeChangeMany: (nodes: NodeChange<EntityNode>[]) => void
  onBeforeEntitiesDelete: (entities: EntityNode[]) => Promise<boolean>
  setEntityViewMode: (mode: EntityViewMode) => void
}

export type EntityStore = EntityStoreState & EntityStoreAction

const initialState: EntityStoreState = {
  entities: [],
  mode: EntityViewMode.EDITOR
}

export const entityStore: StateCreator<UsePlaygroundStore, [], [], EntityStore> = ((set, get) => ({
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
      createdAt: new Date(),
    };

    state.playground.table(EntityEnum.add, newNode)
  },

  onEntityNodeChangeMany: (entities) => {
    const state = get()
    const replacedEntities = []
    const movedEntities: any[] = []
    const removedEntities = []

    entities.forEach((entity) => {
      switch (entity.type) {
        case "replace":
          replacedEntities.push({
            id: entity.item.id,
            type: entity.item.type,
            position: entity.item.position,
          })
          break
        case "position":
          movedEntities.push({
            id: entity.id,
            type: "entity",
            position: entity.position,
          })
          break
        case "remove":
          removedEntities.push(entity.id)
          break
        default:
      }
    })

    // if (replacedEntities.length) {
    //   state.playground.table(EntityEnum.updateMany, replacedEntities)
    // }
    if (movedEntities.length) {
      state.playground.table(EntityEnum.move, movedEntities)
    }
    // if (removedEntities.length) {
    //   state.playground.table(EntityEnum.deleteMany, removedEntities)
    // }

  },


  onEntityNodeChange: (node) => {
    const state = get()
    switch (node.type) {
      case "replace":
        state.playground.table(EntityEnum.update, {
          erdId: state.id,
          id: node.item.id,
          type: node.item.type,
          position: node.item.position,
        })
        break
      case "position":
        const {id, type, position} = state.entities.find(oldNode => oldNode.id === node.id)!

        if (node.position && position !== node.position) {
          state.playground.table(EntityEnum.update, {
            erdId: state.id,
            id,
            type,
            position: node.position!,
          })
        }

        break
      case "remove":
        state.playground.table(EntityEnum.delete, node.id)
        break
      default:
    }
  },

  resetEntityStore: () => set({...initialState, playground: undefined}),

  onBeforeEntitiesDelete: (entities) => {
    return new Promise((resolve) => {
      const entityNames = entities.reduce((names, entity, i) => {
        if (i < entities.length - 1) {
          names += `${entity.data.name}, `
        } else {
          names += `${entity.data.name}`
        }
        return names
      }, "")
      const entityName = entities.length > 1 ? "entities" : "entity"

      set({
        confirmModal: {
          ...get().confirmModal,
          opened: true,
          message: `Are you sure you want to delete ${entityNames} ${entityName}?`,
          onConfirm: (callback) => {
            resolve(true)
            if (callback) {
              callback()
            }
          },
          onCancel: (callback) => {
            resolve(false)
            if (callback) {
              callback()
            }
          }
        }
      })
    })
  },
  setEntityViewMode: (mode) => set({mode})
}))
