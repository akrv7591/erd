import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";
import {EntityNode} from "@/types/diagram";

type Config =  EntityNode['data'] & {
  userId: string
}

interface EntityState {
  configs: Config[]
}
interface EntityAction {
  setConfig: (config: Config) => void
}

export type EntitySlice = EntityState & EntityAction

const initState: EntityState = {
  configs: [],
}

export const entitySlice: StateCreator<DiagramStore, [], [], EntitySlice> = (set) => ({
  ...initState,

  setConfig: (config) => set((state) => {
    const userConfig = state.configs.find(c => c.userId === config.userId)

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
