import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    CurrentUser,
    LoginRequest,
    LoginResponse,
  } from "../types/auth.types";
  
  export const authApi = {
    async login(
      payload: LoginRequest,
    ): Promise<LoginResponse> {
      const { data } =
        await apiClient.post<LoginResponse>(
          API_ENDPOINTS.AUTH.LOGIN,
          payload,
        );
  
      return data;
    },
  
    async me(): Promise<CurrentUser> {
      const { data } =
        await apiClient.get<CurrentUser>(
          API_ENDPOINTS.AUTH.ME,
        );
  
      return data;
    },
  };