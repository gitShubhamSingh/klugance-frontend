"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../store/auth.store";
import { getNextFromLocation, getSafeRedirect } from "../utils/auth-routes";

type Props = {
  children: ReactNode;
};

/**
 * Wraps guest-only pages (login). Once the session is verified, a signed-in
 * admin is sent to `?next=` (if safe) or the dashboard and never sees the page.
 *
 * Runs after AuthProvider has restored the session, so `user` is authoritative.
 */
export function GuestRoute({ children }: Props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const signedIn = isAuthenticated && Boolean(user?.school);

  useEffect(() => {
    if (signedIn) {
      router.replace(getSafeRedirect(getNextFromLocation()));
    }
  }, [signedIn, router]);

  if (signedIn) {
    return null;
  }

  return <>{children}</>;
}
