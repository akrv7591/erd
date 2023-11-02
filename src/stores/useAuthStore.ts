import {create} from "zustand";
import {erdApi} from "../api/erdApi";
import {jwtDecode} from "jwt-decode";
import {IUser} from "../types/data/user";


export interface IAuthState {
  accessToken: string
  authorized: boolean
  user: IUser | null
}

export interface IAuthActions {
  setAccessToken: (accessToken: string) => void
  setAuthorized: (authorized: boolean) => void
  init: (callback?: VoidFunction) => void
  logout: (callback?: VoidFunction) => void
}

interface JWTPayload extends IUser {
  "iat": number,
  "exp": number
}

const initialState = {
  accessToken: "",
  authorized: false,
  user: null,
}

const parseAuthorization = () => {
  const accessToken = localStorage.getItem("Authorization") || ""

  const state: Partial<IAuthState> = {}

  state.accessToken = accessToken;

  if (accessToken) {
    const decoded = jwtDecode<JWTPayload>(accessToken)
    console.log(decoded)

    if (decoded.id) {
      erdApi.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`
      }
      state.user = decoded
      state.authorized = true
    }
  }

  return state
}

export const useAuthStore = create<IAuthState & IAuthActions>()((setState) => ({
  ...initialState,
  ...parseAuthorization(),
  // Actions
  setAccessToken: accessToken => setState({accessToken}),
  setAuthorized: authorized => setState({authorized}),
  init: (callback) => {
    const state = parseAuthorization()

    setState(state)
    if (callback) {
      callback()
    }
  },
  logout: (callback) => {
    localStorage.removeItem("Authorization")
    delete erdApi.defaults?.headers?.common?.Authorization
    setState(initialState)

    if (callback) {
      callback()
    }
  }
}))
