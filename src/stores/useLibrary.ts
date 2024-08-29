import {create} from "zustand";
import {IErd, ITeam} from "@/types/data/db-model-interfaces.ts";

export interface ILibraryState {
  team: ITeam | null
  checkedErds: IErd[]
}

export interface ILibraryViews {
}

export interface ILibraryActions {
  setTeam: (team: ITeam | null) => void
  onErdCheckBoxClick: (erd: IErd) => void
  clearCheckedErds: () => void
  deleteCheckedErds: () => Promise<void>
}

export type ILibraryStore = ILibraryState & ILibraryViews & ILibraryActions

const libraryStoreInitialValue: ILibraryState = {
  team: null,
  checkedErds: []
}

export const useLibraryStore = create<ILibraryStore>()((set) => ({
  ...libraryStoreInitialValue,

  // Actions
  setTeam: team => set({team}),
  onErdCheckBoxClick: erd => set(({checkedErds}) => ({checkedErds: checkedErds.includes(erd) ? checkedErds.filter(e => e !== erd) : [...checkedErds, erd]})),
  clearCheckedErds: () => set({checkedErds: []}),
  deleteCheckedErds: async () => {
    set({checkedErds: []})
  }
}))
