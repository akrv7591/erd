import axios, {AxiosInstance} from "axios";
import { config } from "@/config/config";
import { useLogtoStore } from "@/stores/logto-store";

export class Axios {
  api: AxiosInstance

  constructor() {
    const baseURL = config.server.baseUrl;

    if (!baseURL) {
      throw new Error("BASE_URL in environment is required");
    }

    this.api = axios.create({
      baseURL: baseURL + "/api",
    });

    this.api.interceptors.request.use(async (requestConfig) => {
        const {logto} =  useLogtoStore.getState()

        if (!logto) {
          throw new Error("Logto is not initialized")
        }

        const authorization = await logto.getAccessToken(config.server.baseUrl);

        if (authorization) {
          requestConfig.headers.Authorization = `Bearer ${authorization}`;
        } else {
          console.warn("Authentication required")
          logto.signOut(config.client.url)
        }


      return requestConfig;
    })

    this.api.interceptors.response.use(response => {
      const {logto} =  useLogtoStore.getState()

      if (!logto) {
        throw new Error("Logto is not initialized")
      }

      if (response.status === 401) {
        logto.signOut(config.client.url)
      }
      return response
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
