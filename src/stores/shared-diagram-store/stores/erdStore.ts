import type {IErd} from "@/types/data/db-model-interfaces.ts";
import {SharedDiagramStore} from "../SharedDiagramStore.ts";
import {StateCreator} from "zustand";
import {SetStateObject} from "@/types/util.ts";

type Erd = Pick<IErd, 'id' | 'name' | 'columnNameCase' | 'tableNameCase' | 'description' | 'isPublic' | 'teamId'>

export interface ErdStoreState {
  erd: Erd
}

interface ErdStoreAction {
  setErd: SetStateObject<ErdStoreState['erd']>
  reset: () => void
}

export type ErdStore = ErdStoreAction & ErdStoreState

const initialState: ErdStoreState = {
  erd: {} as ErdStoreState['erd'],
}


export const erdStore: StateCreator<SharedDiagramStore, [], [], ErdStore> = ((set) => ({
  ...initialState,

  setErd: (erd) => set(state => ({
    erd: {
      ...state.erd,
      ...typeof erd === 'function' ? erd(state.erd) : erd
    }
  })),

  reset: () => {
    set(state => {
      state.resetMemoStore();

      return state
    })
  }
}))
