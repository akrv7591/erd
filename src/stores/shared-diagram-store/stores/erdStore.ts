import type {Erd} from "@/types/data/db-model-interfaces.ts";
import {SharedDiagramStore} from "../SharedDiagramStore.ts";
import {StateCreator} from "zustand";
import {SetStateObject} from "@/types/util.ts";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";

export interface DefaultEntityConfig {
  name: string
  color: string
  columns: EntityColumn[]
}

export interface ErdStoreState {
  erd: Pick<Erd, 'id' | 'name' | 'columnNameCase' | 'tableNameCase' | 'description' | 'isPublic' | 'teamId'>,
  entityConfigs: Record<string, DefaultEntityConfig>
}

interface ErdStoreAction {
  setErd: SetStateObject<ErdStoreState['erd']>
  setEntityConfig: (id: string, obj: Partial<DefaultEntityConfig> | ((obj: DefaultEntityConfig) => Partial<DefaultEntityConfig>)) => void
  reset: () => void
}

export type ErdStore = ErdStoreAction & ErdStoreState

const initialState: ErdStoreState = {
  erd: {} as ErdStoreState['erd'],
  entityConfigs: {}
}


export const erdStore: StateCreator<SharedDiagramStore, [], [], ErdStore> = ((set) => ({
  ...initialState,

  setErd: (erd) => set(state => ({
    erd: {
      ...state.erd,
      ...typeof erd === 'function' ? erd(state.erd) : erd
    }
  })),

  setEntityConfig: (id, obj) => {
    set(state => ({
      entityConfigs: {
        ...state.entityConfigs,
        [id]: {
          ...state.entityConfigs[id],
          ...typeof obj === 'function' ? obj(state.entityConfigs[id]) : obj
        }
      }
    }))
  },

  reset: () => {
    set(state => {
      state.resetMemoStore();

      return state
    })
  }
}))
