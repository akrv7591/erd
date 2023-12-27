import {create} from "zustand";
import {ITeam} from "@/types/data/db-model-interfaces";

export interface ILibraryState {
  team: ITeam | null
}

export interface ILibraryViews {

}

export interface ILibraryActions {
  setTeam: (team: ILibraryState['team']) => void
}

export type ILibraryStore = ILibraryState & ILibraryViews & ILibraryActions

export const useLibraryStore = create<ILibraryStore>()((setState) => ({
  team: null,

  // Actions
  setTeam: team => setState({team})
}))
