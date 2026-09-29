import {
    create,
  } from "zustand";
  
  import type {
    CurrentUser,
  } from "../types/auth.types";
  
  interface AuthState {
    accessToken: string | null;
  
    user: CurrentUser | null;
  
    isAuthenticated: boolean;
  
    setAccessToken(
      token: string | null,
    ): void;
  
    setUser(
      user: CurrentUser | null,
    ): void;
  
    logout(): void;
  }
  
  export const useAuthStore =
    create<AuthState>((set) => ({
      accessToken: null,
  
      user: null,
  
      isAuthenticated: false,
  
      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: Boolean(
            token,
          ),
        }),
  
      setUser: (user) =>
        set({
          user,
        }),
  
      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }));