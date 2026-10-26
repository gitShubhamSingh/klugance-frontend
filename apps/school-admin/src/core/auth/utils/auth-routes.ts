/**
 * Single source of truth for auth-related routes. Used by proxy.ts (server)
 * and by the client guards, so both always agree.
 */

export const LOGIN_PATH = "/login";

/** Where a signed-in user lands when there is no safe `next` target. */
export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

/** Only reachable when signed OUT (signed-in users are sent away). */
export const GUEST_ONLY_PATHS = [LOGIN_PATH] as const;

/** Reachable whether signed in or not (token-based flows). */
export const PUBLIC_PATHS = ["/reset-password"] as const;

export const NEXT_PARAM = "next";

function matches(pathname: string, paths: readonly string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isGuestOnlyPath(pathname: string) {
  return matches(pathname, GUEST_ONLY_PATHS);
}

export function isPublicPath(pathname: string) {
  return matches(pathname, PUBLIC_PATHS);
}

/**
 * Returns `next` only if it is a same-origin, relative app path that is not a
 * guest-only page. Prevents open redirects (`//evil.com`, `https://…`, `/\evil`).
 */
export function getSafeRedirect(
  next: string | null | undefined,
  fallback: string = DEFAULT_AUTHENTICATED_PATH,
) {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }

  const pathname = next.split(/[?#]/)[0] ?? "";
  if (isGuestOnlyPath(pathname)) return fallback;

  return next;
}

/** `/login?next=/teacher/students` — omits `next` for the default landing page. */
export function buildLoginPath(next?: string | null) {
  if (!next || next === "/" || next === DEFAULT_AUTHENTICATED_PATH) {
    return LOGIN_PATH;
  }
  return `${LOGIN_PATH}?${NEXT_PARAM}=${encodeURIComponent(next)}`;
}

/** Reads `?next=` from the current URL (client only). */
export function getNextFromLocation() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(NEXT_PARAM);
}
