import dayjs from "dayjs";
import {decodeJwt} from "jose";
import {refreshToken} from "../api/erdApi.tsx";

export default class StorageUtils {
  static setAuthorization(authorization: string) {
    localStorage.removeItem("Authorization")
    sessionStorage.removeItem("Authorization")

    localStorage.setItem("Authorization", authorization)
    sessionStorage.setItem("Authorization", authorization)
    const decoded = decodeJwt(authorization)

    const expireDate = dayjs.unix(decoded.exp as number).subtract(5, 'seconds')
    setTimeout(() => {
      refreshToken()
    }, expireDate.diff(dayjs(), 'milliseconds'))

  }

  static getAuthorization() {
    return localStorage.getItem("Authorization") || ""
  }

  static removeAuthorization() {
    localStorage.removeItem("Authorization")
    sessionStorage.removeItem("Authorization")
  }
}
