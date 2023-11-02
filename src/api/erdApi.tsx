import axios from "axios";

const baseURL = "http://127.0.0.1:3001/api"

if (!baseURL) {
  throw new Error("BASE_URL in environment is required")
}

export const erdApi = axios.create({
  baseURL,
})
