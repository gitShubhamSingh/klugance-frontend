import type {
  AxiosError,
  AxiosInstance,
} from "axios";

import { authApi } from "@/core/auth/api/auth.api";
import { accessToken } from "@/core/auth/utils/access-token";
import { refreshToken } from "@/core/auth/utils/refresh-token";

import type { RetryAxiosRequestConfig } from "../types";

import {
  enqueue,
  isRefreshing,
  rejectQueue,
  resolveQueue,
  startRefreshing,
  stopRefreshing,
} from "./refresh-queue";

export function setupResponseInterceptor(
  api: AxiosInstance,
) {
  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const original =
        error.config as RetryAxiosRequestConfig;

      if (!original) {
        return Promise.reject(error);
      }

      if (
        error.response?.status !== 401 ||
        original._retry
      ) {
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing()) {
        return new Promise((resolve, reject) => {
          enqueue({
            resolve: (token) => {
              original.headers.set(
                "Authorization",
                `Bearer ${token}`,
              );

              resolve(api(original));
            },

            reject,
          });
        });
      }

      startRefreshing();

      try {
        const token = refreshToken.get();

        if (!token) {
          throw error;
        }

        const response = await authApi.refresh({
          refresh_token: token,
        });

        accessToken.set(response.access_token);
        refreshToken.set(response.refresh_token);

        api.defaults.headers.common.Authorization =
          `Bearer ${response.access_token}`;

        resolveQueue(response.access_token);

        original.headers.set(
          "Authorization",
          `Bearer ${response.access_token}`,
        );

        return api(original);
      } catch (e) {
        rejectQueue(e as AxiosError);

        accessToken.remove();
        refreshToken.remove();

        return Promise.reject(e);
      } finally {
        stopRefreshing();
      }
    },
  );
}