import {create} from "zustand";
import {IAuthorizationUser} from "../types/data/user";
import {decodeJwt} from "jose";


export interface IAuthState {
  accessToken: string
}

export interface IParseAuthorization extends IAuthState {
  decoded: IAuthorizationUser
}

export interface IAuthView {
  getAuthorization: () => IAuthorizationUser | null | undefined
}

export interface IAuthActions {
  setAccessToken: (accessToken: string) => void
  init: (callback?: VoidFunction) => void
  logout: (callback?: VoidFunction) => void
}

const initialState = {
  accessToken: ""
}

const parseAuthorization = () => {
  const accessToken = localStorage.getItem("Authorization") || ""

  const state: Partial<IParseAuthorization> = {}

  if (accessToken) {
    try {
      const decoded = decodeJwt(accessToken)
      state.accessToken = accessToken;
      state.decoded = decoded as IAuthorizationUser
    } catch (e) {

    }
  }

  return state
}

export const useAuthStore = create<IAuthState & IAuthView & IAuthActions>()((setState) => ({
  ...initialState,
  //Views
  getAuthorization: () => parseAuthorization().decoded,
  // Actions
  setAccessToken: accessToken => setState({accessToken}),
  init: (callback) => {
    const state = parseAuthorization()

    setState({
      accessToken: state.accessToken
    })
    if (callback) {
      callback()
    }
  },
  logout: (callback) => {
    localStorage.removeItem("Authorization")
    setState(initialState)

    if (callback) {
      callback()
    }
  }
}))
