import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {EntityData, EntityNode} from "@/types/diagram";
import {NODE} from "@/namespaces/broadcast/node";
import {EntityUtils} from "@/utility/EntityUtils";

export type EntityConfig =  EntityNode['data'] & {
  userId: string
}

interface EntityState {
  configs: EntityConfig[]
}
interface EntityAction {
  updateEntityData: (entityId: string, dataOrFunction: Partial<EntityData> | ((data: EntityData) => Partial<EntityData>)) => void
  updateEntityConfig: (data: NODE.ENTITY.CONFIG_UPDATE['value']) => void
  updateEntityName: (data: NODE.ENTITY.NAME_UPDATE['value']) => void
  updateEntityColor: (data: NODE.ENTITY.COLOR_UPDATE['value']) => void
  addEntityColumn: (data: NODE.ENTITY.COLUMN_ADD['value']) => void
  updateEntityColumn: (data: NODE.ENTITY.COLUMN_UPDATE['value']) => void
  deleteEntityColumn: (data: NODE.ENTITY.COLUMN_DELETE['value']) => void
}

export type EntitySlice = EntityState & EntityAction

const initState: EntityState = {
  configs: [],
}

export const entitySlice: StateCreator<DiagramStore, [], [], EntitySlice> = (set) => ({
  ...initState,

  updateEntityData: (entityId, dataOrFunction) => set((state) => {
    const updatedState = {}
    EntityUtils.updateData(updatedState, state, entityId, dataOrFunction)
    return updatedState
  }),

  updateEntityConfig: (config) => set((state) => {
    const userConfig = state.configs.find(c => c.userId === config.userId)

    state.socket.broadcastData([
      {
        type: NODE.ENTITY.TYPE.CONFIG_UPDATE,
        value: config
      }
    ])

    if (userConfig) {
      return {
        configs: state.configs.map(c => {
          if (c.userId !== config.userId) {
            return c
          }
          return config
        })
      }
    }

    return {
      configs: [...state.configs, config]
    }
  }),

  updateEntityName: (data) => set((state) => {
    const updatedState = {}
    state.socket.broadcastData([
      {
        type: NODE.ENTITY.TYPE.NAME_UPDATE,
        value: data
      }
    ])

    EntityUtils.updateName(updatedState, state, data)
    return updatedState
  }),

  updateEntityColor: (data) => set((state) => {
    const updatedState = {}
    state.socket.broadcastData([
      {
        type: NODE.ENTITY.TYPE.COLOR_UPDATE,
        value: data
      }
    ])

    EntityUtils.updateColor(updatedState, state, data)
    return updatedState
  }),

  addEntityColumn: (data) => set((state) => {
    const updatedState = {}
    state.socket.broadcastData([
      {
        type: NODE.ENTITY.TYPE.COLUMN_ADD,
        value: data
      }
    ])

    EntityUtils.addColumn(updatedState, state, data)
    return updatedState
  }),


  updateEntityColumn: (data) => set((state) => {
    const updatedState = {}
    state.socket.broadcastData([
      {
        type: NODE.ENTITY.TYPE.COLUMN_UPDATE,
        value: data
      }
    ])

    EntityUtils.updateColumn(updatedState, state, data)
    return updatedState
  }),

  deleteEntityColumn: (data) => set((state) => {
    const updatedState = {}

    state.socket.broadcastData([
      {
        type: NODE.ENTITY.TYPE.COLUMN_DELETE,
        value: data
      }
    ])

    EntityUtils.deleteColumn(updatedState, state, data)
    return updatedState
  }),
})
