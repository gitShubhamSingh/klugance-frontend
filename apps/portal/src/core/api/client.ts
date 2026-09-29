import axios from "axios";

import {
  appConfig,
} from "@/core/config";

import {
  setupRequestInterceptor,
} from "./interceptors/request";

export const apiClient =
  axios.create({
    baseURL: appConfig.apiBaseUrl,

    timeout: 30000,

    headers: {
      "Content-Type":
        "application/json",

      Accept:
        "application/json",
    },
  });

setupRequestInterceptor(
  apiClient,
);