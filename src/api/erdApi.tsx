import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL

if (!baseURL) {
  throw new Error("BASE_URL in environment is required")
}

export const erdApi = axios.create({
  baseURL,
})
