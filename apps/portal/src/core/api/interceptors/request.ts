import type {
    AxiosInstance,
  } from "axios";
  
  import {
    accessToken,
  } from "@/core/auth/utils";
  
  import {
    AUTHORIZATION_HEADER,
    BEARER_PREFIX,
  } from "../constants";
  
  export function setupRequestInterceptor(
    api: AxiosInstance,
  ) {
    api.interceptors.request.use(
      (config) => {
        const token = accessToken.get();
  
        if (token) {
          config.headers.set(
            AUTHORIZATION_HEADER,
            `${BEARER_PREFIX} ${token}`,
          );
        }
  
        return config;
      },
  
      (error) =>
        Promise.reject(error),
    );
  }