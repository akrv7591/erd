import axios from "axios";
import httpStatus from "http-status";
import {errors} from "jose";
import StorageUtils from "../utility/StorageUtils.ts";
import {useAuthStore} from "../stores/useAuthStore.ts";

const baseURL = import.meta.env.VITE_BASE_URL

if (!baseURL) {
  throw new Error("BASE_URL in environment is required")
}

const erdApi = axios.create({
  baseURL: baseURL+"/api",
  withCredentials: true,
})

const refreshToken = async () => {
  await erdApi.post<{accessToken: string}>("/v1/auth/refresh")
    .then(res => {
      console.log(res.data)
      localStorage.setItem("Authorization", res.data.accessToken)
    })
    .catch(() => {
      localStorage.removeItem("Authorization")
    })
}

erdApi.interceptors.request.use(function (config) {
  const authorization = localStorage.getItem("Authorization") || sessionStorage.getItem("Authorization")

  if (authorization) {
    config.headers.Authorization = `Bearer ${authorization}`
  }

  return config
})

erdApi.interceptors.response.use(
  (response) => {
    if (response.data.count !== undefined) {
      console.log(response.config.url, response.data.rows)
    } else {
      console.log(response.config.url, response.data)
    }
    return response
  },
  async (err) => {
    const {response} = err
    switch (response.status) {
      case httpStatus.FORBIDDEN:
        switch (response.data.message){
          case errors.JWTExpired.code:
            console.log("trying to refresh token")

            await refreshToken()
            return erdApi.request(response.config)
        }
        break

      case httpStatus.UNAUTHORIZED:
        StorageUtils.removeAuthorization()
        useAuthStore.getState().logout()
        console.log("navigating to home")
        return Promise.reject(err)

    }

    return Promise.reject(err)
  }

  )

export default erdApi
