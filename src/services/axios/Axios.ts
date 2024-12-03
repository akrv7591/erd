import axios from "axios";
import { config } from "@/config/config";
import { useLogtoStore } from "@/stores/logto-store";

const baseURL = config.server.baseUrl;

if (!baseURL) {
  throw new Error("BASE_URL in environment is required");
}

const axiosInstance = axios.create({
  baseURL: baseURL + "/api",
});


axiosInstance.interceptors.response.use(response => {
  return response
}, (error) => {

  const { logto } = useLogtoStore.getState()

  if (!logto) {
    throw new Error("Logto is not initialized")
  }

  if (error.response.status === 401) {
    console.log("Sign out")
    logto.signOut(config.client.url)
  }

  return Promise.reject(error);
})

axiosInstance.interceptors.request.use(async (requestConfig) => {
  const { logto } = useLogtoStore.getState()

  if (!logto) {
    throw new Error("Logto is not initialized")
  }

  const authorization = await logto.getAccessToken(config.server.baseUrl);

  if (authorization) {
    requestConfig.headers.Authorization = `Bearer ${authorization}`;
  } 

  return requestConfig;
}, (error) => {
  return Promise.reject(error);
});


export {
  axiosInstance
}