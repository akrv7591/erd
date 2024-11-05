import {AxiosError} from "axios";

export interface ApiError {}

export interface AxiosApiError extends Required<AxiosError<ApiError>> {}
