import axios from "axios";
import {AUTH} from "../enums/auth.ts";
import {useAuthStore} from "../stores/useAuthStore.ts";
import StorageUtils from "../utility/StorageUtils.ts";
import httpStatus from "http-status";

const baseURL = import.meta.env.VITE_BASE_URL

if (!baseURL) {
  throw new Error("BASE_URL in environment is required")
}

const erdApi = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
})


export const refreshToken = async () => {
  await erdApi.post<{ accessToken: string }>("/v1/auth/refresh")
    .then(res => {
      console.log(res.data)
      StorageUtils.setAuthorization(res.data.accessToken)
      useAuthStore.getState().init()
    })
}

erdApi.interceptors.request.use(async function (config) {
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

    switch (response.status) {
      case httpStatus.BAD_REQUEST:
        return Promise.reject(err)
      case httpStatus.INTERNAL_SERVER_ERROR:
        return Promise.reject(err)
    }


    switch (response.data.code) {
      case AUTH.ACCESS_TOKEN_EXPIRED:
        console.log("trying to refresh token")

        await refreshToken()
        console.log("REFRESH FINISHED")
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
