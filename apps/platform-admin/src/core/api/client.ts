import axios from "axios";

import { appConfig } from "@/core/config";

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

import { setupRequestInterceptor } from "./interceptors/request";
import { setupResponseInterceptor } from "./interceptors/response";

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);