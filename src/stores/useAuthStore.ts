import {create} from "zustand";
import {decodeJwt} from "jose";
import {router} from "@/routers/RootRouter.tsx";
import {SocialLogin} from "@/constants/auth.ts";
import erdApi from "@/api/erdApi.tsx";
import StorageUtils from "@/utility/StorageUtils.ts";
import {ITokenPayload} from "@/types/auth.ts";
import {signingError, signingSuccess} from "@/screens/Auth/Signin/constants.ts";
import {IProfile, IUser} from "@/types/data/db-model-interfaces.ts";

export interface User extends IUser {
  profile: IProfile
}

export interface IAuthState {
  accessToken: string
  user: User
}

export interface IParseAuthorization extends IAuthState {
  decoded: ITokenPayload
}

export interface IAuthView {
  getAuthorization: () => ITokenPayload | null | undefined
}

type SocialLoginType = SocialLogin.GOOGLE

export interface IAuthActions {
  setAccessToken: (accessToken: string) => void
  fetchAndSetUser: () => Promise<void>
  init: (callback?: VoidFunction) => void
  socialLogin: (type: SocialLoginType, authObjs: any) => Promise<void>
  logout: (callback?: VoidFunction) => void
}

const initialState: IAuthState = {
  accessToken: StorageUtils.getAuthorization(),
  user: {} as Required<IUser>
}

const parseAuthorization = () => {
  const accessToken = StorageUtils.getAuthorization()

  const state: Partial<IParseAuthorization> = {}

  if (accessToken) {
    try {
      const decoded = decodeJwt(accessToken)
      state.accessToken = accessToken;
      state.decoded = decoded as ITokenPayload
    } catch (e) {

    }
  }

  return state
}

export const useAuthStore = create<IAuthState & IAuthView & IAuthActions>()((setState, getState) => ({
  ...initialState,
  //Views
  getAuthorization: () => parseAuthorization().decoded,

  fetchAndSetUser: async () => {
    const state = getState()
    try {
      const res = await erdApi.get<User>(`/v1/users/${state.getAuthorization()!.id}`)

      if (res.data) {
        setState({user: res.data})
      }

    } catch (e) {
      state.logout()
    }
  },

  // Actions
  setAccessToken: accessToken => setState({accessToken}),
  socialLogin: async (type, authObjs) => {
    let loginSuccess = false

    switch (type) {
      case SocialLogin.GOOGLE:
        try {
          const res = await erdApi.post("/v1/auth/google", authObjs)
          StorageUtils.setAuthorization(res.data.accessToken)
          loginSuccess = true
        } catch (e) {
          loginSuccess = false
        }
    }

    if (loginSuccess) {
      getState().init()
      signingSuccess()
    } else {
      signingError()
    }
  },


  init: async (callback) => {
    const authorization = parseAuthorization()
    const state = getState()

    await state.fetchAndSetUser()

    setState({
      accessToken: authorization.accessToken
    })
    if (callback) {
      callback()
    }
  },
  logout: (callback) => {
    StorageUtils.removeAuthorization()
    setState(initialState)
    console.log("logging out")
    router.navigate("/").then(() => {
      if (callback) {
        callback()
      }
    })
  }
}))
