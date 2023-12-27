import {JWTPayload} from "jose";
import {IUser} from "@/types/data/db-model-interfaces";


export type IAuthorizationUser = IUser & JWTPayload
