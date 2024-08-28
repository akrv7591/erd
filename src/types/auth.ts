import type {JWTPayload} from "jose";

export type ITokenPayload = JWTPayload & {
  id: string
}
