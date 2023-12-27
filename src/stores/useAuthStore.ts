import {create} from "zustand";
import {decodeJwt} from "jose";
import {router} from "../routers/RootRouter.tsx";
import {SocialLogin} from "../constants/auth.ts";
import erdApi from "../api/erdApi.tsx";
import {signingError, signingSuccess} from "../screens/Auth/SignIn.tsx";
import StorageUtils from "../utility/StorageUtils.ts";
import {IAuthorizationUser} from "@/types/auth";


export interface IAuthState {
  accessToken: string
}

export interface IParseAuthorization extends IAuthState {
  decoded: IAuthorizationUser
}

export interface IAuthView {
  getAuthorization: () => IAuthorizationUser | null | undefined
}

type SocialLoginType = SocialLogin.GOOGLE

export interface IAuthActions {
  setAccessToken: (accessToken: string) => void
  init: (callback?: VoidFunction) => void
  socialLogin: (type: SocialLoginType, authObjs: any) => Promise<void>
  logout: (callback?: VoidFunction) => void
}

const initialState = {
  accessToken: ""
}

const parseAuthorization = () => {
  const accessToken = StorageUtils.getAuthorization()

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

export const useAuthStore = create<IAuthState & IAuthView & IAuthActions>()((setState, getState) => ({
  ...initialState,
  //Views
  getAuthorization: () => parseAuthorization().decoded,
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
