import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {EntityNode} from "@/types/diagram";
import { BROADCAST } from "@/namespaces";

export type EntityConfig =  EntityNode['data'] & {
  userId: string
}

interface EntityState {
  configs: EntityConfig[]
}
interface EntityAction {
  setConfig: (config: EntityConfig) => void
}

export type EntitySlice = EntityState & EntityAction

const initState: EntityState = {
  configs: [],
}

export const entitySlice: StateCreator<DiagramStore, [], [], EntitySlice> = (set) => ({
  ...initState,

  setConfig: (config) => set((state) => {
    const userConfig = state.configs.find(c => c.userId === config.userId)

    state.webrtc.broadcastData([
      {
        type: BROADCAST.DATA.TYPE.ENTITY_CONFIG_CHANGE,
        server: true,
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
  })
})
