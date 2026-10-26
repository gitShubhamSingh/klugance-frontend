/**
 * Session hint cookie.
 *
 * Tokens live in localStorage, which the Next.js server (proxy.ts) cannot read.
 * This tiny cookie only says "this browser has a signed-in session" so the
 * proxy can redirect *before* a page renders (e.g. /login → /dashboard).
 *
 * It contains no token or user data and is NOT a security boundary — every API
 * call is still authorised by the backend with the bearer token, and the client
 * re-validates the session with /auth/me on load.
 */
export const SESSION_HINT_COOKIE = "klugance_school_session";

/** Keep in line with how long a refresh token can keep the user signed in. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const sessionHint = {
  set(): void {
    if (typeof document === "undefined") return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${SESSION_HINT_COOKIE}=1; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  },

  remove(): void {
    if (typeof document === "undefined") return;

    document.cookie = `${SESSION_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  },
};
