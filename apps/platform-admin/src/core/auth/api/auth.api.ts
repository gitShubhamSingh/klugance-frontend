import { apiClient } from "@/core/api/client";

import type {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  CurrentUser,
} from "../types/auth.types";

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload,
    );

    return data;
  },

  async refresh(
    payload: RefreshRequest,
  ): Promise<RefreshResponse> {
    const { data } = await apiClient.post<RefreshResponse>(
      "/auth/refresh",
      payload,
    );

    return data;
  },

  async me(): Promise<CurrentUser> {
    const { data } = await apiClient.get<CurrentUser>(
      "/auth/me",
    );

    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },
};