import axios, {AxiosInstance} from "axios";
import { config } from "@/config/config";
import {useLogto} from "@logto/react"

export class Axios {
  api: AxiosInstance
  logTo: ReturnType<typeof useLogto> | undefined

  constructor() {
    const baseURL = config.server.baseUrl;

    if (!baseURL) {
      throw new Error("BASE_URL in environment is required");
    }

    this.api = axios.create({
      baseURL: baseURL + "/api",
    });

    this.api.interceptors.request.use(async (requestConfig) => {

      if (this.logTo) {
        const authorization = await this.logTo.getAccessToken(config.server.baseUrl);

        if (authorization) {
          requestConfig.headers.Authorization = `Bearer ${authorization}`;
        }
      }

      return requestConfig;
    })

  }

  private static _instance: Axios

  static get instance () {
    if (!Axios._instance) {
      Axios._instance = new Axios()
    }

    return Axios._instance
  }
}
