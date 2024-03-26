import {AUTH} from "@/enums/auth.ts";
import {AxiosError} from "axios";

export type ApiCode = AUTH

export interface ApiError {
  code: ApiCode
}

export interface AxiosApiError extends Required<AxiosError<ApiError>> {}
