import { queryClient } from "@/core/query/query-client";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { accessToken, refreshToken, sessionHint } from "../utils";
import { getPortalRole } from "../utils/portal-role";

export const sessionService = {
  async login(username: string, password: string) {
    // Drop data and tokens that belong to any previous session first.
    await queryClient.cancelQueries();
    queryClient.clear();
    this.clear();

    try {
      const response = await authApi.login({
        username,
        password,
        app: "portal",
      });

      accessToken.set(response.access_token);
      refreshToken.set(response.refresh_token);

      useAuthStore.getState().setAccessToken(response.access_token);

      const user = await authApi.me();

      if (!user.school) {
        throw new Error("Your account is not assigned to a school.");
      }

      if (!getPortalRole(user)) {
        throw new Error(
          "Your account does not have exactly one valid Portal role.",
        );
      }

      // Only mark the browser as signed in once the session is fully valid
      // (set before the store update so redirects never race the cookie).
      sessionHint.set();
      useAuthStore.getState().setUser(user);

      return user;
    } catch (error) {
      this.clear();
      throw error;
    }
  },

  async restore() {
    const token = accessToken.get();

    if (!token) {
      this.clear();
      return null;
    }

    try {
      useAuthStore.getState().setAccessToken(token);

      const user = await authApi.me();

      if (!user.school || !getPortalRole(user)) {
        this.clear();
        return null;
      }

      sessionHint.set();
      useAuthStore.getState().setUser(user);

      return user;
    } catch {
      this.clear();
      return null;
    }
  },

  /** Removes tokens, the session hint cookie and in-memory auth state. */
  clear() {
    accessToken.remove();
    refreshToken.remove();
    sessionHint.remove();
    useAuthStore.getState().logout();
  },

  logout() {
    void queryClient.cancelQueries();
    queryClient.clear();
    this.clear();
  },
};
