import axios, {type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import StorageUtils from "@/utility/StorageUtils.ts";
import {config} from "@/config/config.ts";

const baseURL = config.server.baseUrl
const REFRESH_URL = "/v1/auth/refresh"

if (!baseURL) {
  throw new Error("BASE_URL in environment is required")
}

let isRefreshing = false
const waitList: {
  resolve: Function,
  reject: Function,
  config: InternalAxiosRequestConfig | Promise<AxiosResponse>
}[] = []

const onRefreshSettled = (success: boolean) => {
  waitList.forEach((request) => {
    success ? request.resolve(request.config) : request.reject(request.config)
    waitList.pop()
  })
  isRefreshing = false

}

const erdApi = axios.create({
  baseURL: baseURL + "/api",
})


const handleRefresh = (config: InternalAxiosRequestConfig | Promise<AxiosResponse>) => (resolve: Function, reject: Function) => {
  waitList.push({resolve, reject, config})
}


export const refreshToken = async () => {
  try {
    const res = await erdApi.post<{ accessToken: string }>(REFRESH_URL)
    StorageUtils.setAuthorization(res.data.accessToken)
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

export default erdApi
