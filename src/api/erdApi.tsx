import axios, {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {AUTH} from "@/enums/auth.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import StorageUtils from "@/utility/StorageUtils.ts";

// const baseURL = import.meta.env.VITE_BASE_URL
const baseURL = "https://erdiagramly-api.akrv.dev"
const REFRESH_URL = "/v1/auth/refresh"

if (!baseURL) {
  throw new Error("BASE_URL in environment is required")
}

let isRefreshing = false
const waitList: { resolve: Function, reject: Function, config: InternalAxiosRequestConfig | Promise<AxiosResponse> }[] = []

const onRefreshSettled = (success: boolean) => {
  waitList.forEach((request) => {
    success ? request.resolve(request.config) : request.reject(request.config)
    waitList.pop()

  })
  isRefreshing = false
}

const erdApi = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
})


const handleRefresh = (config: InternalAxiosRequestConfig | Promise<AxiosResponse>) => (resolve: Function, reject: Function) => {
  waitList.push({resolve, reject, config})
}


export const refreshToken = async () => {
  try {
    const res = await erdApi.post<{ accessToken: string }>(REFRESH_URL)
    StorageUtils.setAuthorization(res.data.accessToken)
    useAuthStore.getState().init()
    onRefreshSettled(true)
  } catch (e) {
    onRefreshSettled(false)
  }
}

erdApi.interceptors.request.use(async function (config) {
  if (isRefreshing) {
    return await new Promise(handleRefresh(config))
  }

  if (config.url === REFRESH_URL) {
    isRefreshing = true
  }
  const authorization = StorageUtils.getAuthorization()

  if (authorization) {
    config.headers.Authorization = `Bearer ${authorization}`
  }

  return config
})

const logout = (err: Error) => {
  useAuthStore.getState().logout()
  return Promise.reject(err)
}


erdApi.interceptors.response.use(
  (response) => {
    console.log(response.config.url, response.data)
    return response
  },
  async (err) => {
    const {response} = err

    switch (response.data.code) {
      case AUTH.ACCESS_TOKEN_EXPIRED:
        if (isRefreshing) {
          return new Promise(handleRefresh(erdApi.request(response.config)))
        }
        await refreshToken()
        return erdApi.request(response.config)

      case AUTH.INVALID_ACCESS_TOKEN:
        return logout(err)

      case AUTH.INVALID_AUTHORIZATION:
        return logout(err)

      case AUTH.NO_REFRESH_TOKEN_IN_COOKIES:
        return logout(err)

      case AUTH.REFRESH_TOKEN_INVALID:
        return logout(err)

      default:
        return Promise.reject(err)

    }
  }
)

export default erdApi
