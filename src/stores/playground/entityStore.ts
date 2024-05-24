import {StateCreator} from "zustand";
import {EntityNode, EntityNodeColumn, EntityNodeData} from "@/types/entity-node";
import {XYPosition} from "@xyflow/react";
import {EntityEnum, EntityViewMode} from "@/enums/playground.ts";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {createId} from "@paralleldrive/cuid2";
import voca, {Chain} from "voca";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

interface EntityStoreState {
  mode: EntityViewMode
}

interface EntityStoreAction {
  entityOnDragAdd: (position: XYPosition) => void
  resetEntityStore: () => void
  onBeforeEntitiesDelete: (entities: EntityNode[]) => Promise<boolean>
  setEntityViewMode: (mode: EntityViewMode) => void
}

export type EntityStore = EntityStoreState & EntityStoreAction

const initialState: EntityStoreState = {
  mode: EntityViewMode.EDITOR
}

export const entityStore: StateCreator<PlaygroundStore, [], [], EntityStore> = ((set) => ({
  ...initialState,

  //Actions
  entityOnDragAdd: (position) => {
    set(state => {
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

      state.playground.entity(EntityEnum.add, newNode)

      console.log({newNode})

      return {}
    })

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
            state.playground.entity(EntityEnum.delete, entities.map(entity => entity.id))
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
        }
      }))
    })
  },
  setEntityViewMode: (mode) => set({mode}),
  resetEntityStore: () => set({...initialState, playground: undefined}),
}))
