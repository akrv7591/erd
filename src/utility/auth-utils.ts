import {ITokenPayload} from "@/types/auth.ts";
import dayjs from "dayjs";

export class AuthUtils {
  static isAuthenticated(payload: ITokenPayload) {
    const isExpired = AuthUtils.isAuthExpired(payload)

    return !isExpired
  }

  static isAuthExpired(payload: ITokenPayload) {
    if (!payload.exp) return false

    return dayjs().unix() > payload.exp * 1000
  }
}
