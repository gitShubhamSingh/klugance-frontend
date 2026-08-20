import {
    authApi,
  } from "../api/auth.api";
  
  import {
    useAuthStore,
  } from "../store/auth.store";
  
  import {
    accessToken,
    refreshToken,
  } from "../utils";
  
  export const sessionService = {
    async login(
      username: string,
      password: string,
    ) {
      const response =
        await authApi.login({
          username,
          password,
        });
  
      accessToken.set(
        response.access_token,
      );
  
      refreshToken.set(
        response.refresh_token,
      );
  
      useAuthStore
        .getState()
        .setAccessToken(
          response.access_token,
        );
  
      try {
        const user =
          await authApi.me();
  
        /*
         * A School Admin session must belong
         * to a school.
         */
        if (!user.school) {
          throw new Error(
            "This user is not assigned to a school.",
          );
        }
  
        useAuthStore
          .getState()
          .setUser(user);
  
        return user;
      } catch (error) {
        this.clear();
  
        throw error;
      }
    },
  
    async restore() {
      const token =
        accessToken.get();
  
      if (!token) {
        this.clear();
  
        return null;
      }
  
      try {
        useAuthStore
          .getState()
          .setAccessToken(token);
  
        const user =
          await authApi.me();
  
        if (!user.school) {
          this.clear();
  
          return null;
        }
  
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
      accessToken.remove();
      refreshToken.remove();
  
      useAuthStore
        .getState()
        .logout();
    },
  
    logout() {
      this.clear();
    },
  };