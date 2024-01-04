import {create} from "zustand";
import {IFormTeam} from "@/contexts/forms/TeamFormContext.ts";

export interface ILibraryState {
  team: IFormTeam | null
  teams: IFormTeam[]
}

export interface ILibraryViews {

}

export interface ILibraryActions {
  setTeam: (team: ILibraryState['team']) => void
}

export type ILibraryStore = ILibraryState & ILibraryViews & ILibraryActions

const libraryStoreInitialValue: ILibraryState = {
  team: null,
  teams: [],
}

export const useLibraryStore = create<ILibraryStore>()((setState) => ({
  ...libraryStoreInitialValue,

  // Actions
  setTeam: team => setState({team})
}))
