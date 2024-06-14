import type {IErd} from "@/types/data/db-model-interfaces";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {StateCreator} from "zustand";

export interface ErdStoreState extends Omit<IErd, 'entities' | 'relations' | 'users' | 'memos'> {}

interface ErdStoreAction {
  reset: () => void
}

export type ErdStore = ErdStoreAction & ErdStoreState

const initialState: ErdStoreState = {
  id: "",
  createdAt: "",
  updatedAt: "",
  name: "",
  isPublic: false,
  description: "",
  teamId: "",
  tableNameCase: "pascal",
  columnNameCase: "camel",
}


export const erdStore: StateCreator<PlaygroundStore, [], [], ErdStore> = ((set) => ({
  ...initialState,

  reset: () => {
    set(state => {
      state.resetEntityStore();
      state.resetRelationStore();
      state.resetPaneStore();
      state.resetMemoStore();

      return state
    })
  }
}))
