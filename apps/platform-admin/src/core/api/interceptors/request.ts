import { AxiosInstance } from "axios";

import { accessToken } from "@/core/auth/utils/access-token";

import {
  AUTHORIZATION_HEADER,
  BEARER_PREFIX,
} from "../constants";

export function setupRequestInterceptor(api: AxiosInstance) {
  console.log(">>> setupRequestInterceptor registered");

  api.interceptors.request.use(
    (config) => {
      console.log(">>> Request interceptor fired");
      console.log("URL:", config.url);

      const token = accessToken.get();

      console.log("Token from localStorage:", token);

      if (token) {
        config.headers.set(
          AUTHORIZATION_HEADER,
          `${BEARER_PREFIX} ${token}`,
        );

        console.log(
          "Authorization Header:",
          config.headers.get(AUTHORIZATION_HEADER),
        );
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}