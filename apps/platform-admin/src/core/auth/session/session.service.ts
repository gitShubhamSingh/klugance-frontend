import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { accessToken } from "../utils/access-token";
import { refreshToken } from "../utils/refresh-token";

export const sessionService = {
    async login(email: string, password: string) {
        console.log("sessionService.login()");
        const response = await authApi.login({
          username: email,
          password,
        });
      
        console.log("LOGIN RESPONSE:", response);
      
        accessToken.set(response.access_token);
        refreshToken.set(response.refresh_token);
      
        console.log("Saved access token:", accessToken.get());
        console.log("Saved refresh token:", refreshToken.get());
      
        useAuthStore.getState().setAccessToken(response.access_token);
      
        const user = await authApi.me();
      
        console.log("CURRENT USER:", user);
      
        useAuthStore.getState().setUser(user);
      
        return user;
      },

  async restore() {
    const token = accessToken.get();
    const refresh = refreshToken.get();

    if (!token || !refresh) {
    return null;
    }

    try {
      useAuthStore
        .getState()
        .setAccessToken(token);

      const user = await authApi.me();

      useAuthStore
        .getState()
        .setUser(user);

      return user;
    } catch {
      this.clear();

      return null;
    }
  },

  clear() {
    console.trace("SESSION CLEAR CALLED");
    accessToken.remove();
    refreshToken.remove();

    useAuthStore
      .getState()
      .logout();
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      this.clear();
    }
  },
};