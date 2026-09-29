const REFRESH_TOKEN_KEY =
  "school_admin_refresh_token";

export const refreshToken = {
  get(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(
      REFRESH_TOKEN_KEY,
    );
  },

  set(token: string): void {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      token,
    );
  },

  remove(): void {
    localStorage.removeItem(
      REFRESH_TOKEN_KEY,
    );
  },
};