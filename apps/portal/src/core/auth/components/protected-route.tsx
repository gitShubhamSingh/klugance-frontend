"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "../store/auth.store";
import { buildLoginPath } from "../utils/auth-routes";
import {
  getPortalRole,
  PORTAL_DASHBOARDS,
  type PortalRole,
} from "../utils/portal-role";

type Props = {
  children: ReactNode;
  /** Omit to allow any authenticated portal role (e.g. the shared /dashboard). */
  allowedRole?: PortalRole;
};

export function ProtectedRoute({ children, allowedRole }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const actualRole = user ? getPortalRole(user) : null;
  const signedIn = isAuthenticated && Boolean(user?.school) && Boolean(actualRole);

  useEffect(() => {
    if (!signedIn) {
      // Remember where the user was going so login can bring them back.
      router.replace(buildLoginPath(`${pathname}${window.location.search}`));
      return;
    }

    if (allowedRole && actualRole && actualRole !== allowedRole) {
      router.replace(PORTAL_DASHBOARDS[actualRole]);
    }
  }, [signedIn, actualRole, allowedRole, pathname, router]);

  if (!signedIn || (allowedRole && actualRole !== allowedRole)) {
    return null;
  }

  return <>{children}</>;
}
