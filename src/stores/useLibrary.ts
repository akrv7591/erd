import {create} from "zustand";
import {UserTeam} from "@/types/log-to/user-team";

export interface ILibraryState {
  initialized: boolean
  personal: UserTeam
  isPersonal: boolean
  team: UserTeam
  teamList: UserTeam[]
}

export interface ILibraryViews {
}

export interface ILibraryActions {
  setTeam: (team: UserTeam) => void
}

export type ILibraryStore = ILibraryState & ILibraryViews & ILibraryActions

const libraryStoreInitialValue: ILibraryState = {
  personal: {} as UserTeam,
  team: {} as UserTeam,
  isPersonal: false,
  teamList: [],
  initialized: false,
}

export const useLibraryStore = create<ILibraryStore>()((set) => ({
  ...libraryStoreInitialValue,

  // Actions
  setTeam: team => {
    set(state => ({team, isPersonal: team?.id === state.personal?.id}))
  },
}))
