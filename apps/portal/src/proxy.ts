import { NextResponse, type NextRequest } from "next/server";

import {
  LOGIN_PATH,
  NEXT_PARAM,
  getSafeRedirect,
  isGuestOnlyPath,
  isPublicPath,
} from "@/core/auth/utils/auth-routes";
import { SESSION_HINT_COOKIE } from "@/core/auth/utils/session-hint";

/**
 * Optimistic route guard (runs before rendering, on full loads and on
 * client-side navigations).
 *
 * - Signed-in users can't open /login → sent to `next` or /dashboard.
 * - Signed-out users can't open app pages → sent to /login?next=…
 *
 * The real check still happens on the client (/auth/me) and in the API.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_HINT_COOKIE)?.value === "1";

  if (isGuestOnlyPath(pathname)) {
    if (hasSession) {
      const target = getSafeRedirect(request.nextUrl.searchParams.get(NEXT_PARAM));
      return NextResponse.redirect(new URL(target, request.url));
    }

    // Never serve the login page from cache (browser back button / bfcache).
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    return response;
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL(LOGIN_PATH, request.url);
    if (pathname !== "/") {
      url.searchParams.set(NEXT_PARAM, `${pathname}${search}`);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals, API routes and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.[^/]+$).*)"],
};
