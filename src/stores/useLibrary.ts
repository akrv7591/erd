import {create} from "zustand";
import {IFormTeam} from "@/contexts/forms/TeamFormContext.ts";
import {IErd} from "@/types/data/db-model-interfaces";

export interface ILibraryState {
  team: IFormTeam | null
  teams: IFormTeam[]
  checkedErds: IErd[]
}

export interface ILibraryViews {
}

export interface ILibraryActions {
  setTeam: (team: IFormTeam | null) => void
  onErdCheckBoxClick: (erd: IErd) => void
  clearCheckedErds: () => void
  deleteCheckedErds: () => Promise<void>
}

export type ILibraryStore = ILibraryState & ILibraryViews & ILibraryActions

const libraryStoreInitialValue: ILibraryState = {
  team: null,
  teams: [],
  checkedErds: []
}

export const useLibraryStore = create<ILibraryStore>()((set) => ({
  ...libraryStoreInitialValue,

  // Actions
  setTeam: team => set({team}),
  onErdCheckBoxClick: erd => set(({checkedErds}) => ({checkedErds: checkedErds.includes(erd) ? checkedErds.filter(e => e !== erd) : [...checkedErds, erd]})),
  clearCheckedErds: () => set({checkedErds: []}),
  deleteCheckedErds: async () => {
    await Promise
    set({checkedErds: []})
  }
}))
