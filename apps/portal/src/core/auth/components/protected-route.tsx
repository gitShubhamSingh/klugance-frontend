"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../store/auth.store";
import {
  getPortalRole,
  PORTAL_DASHBOARDS,
  type PortalRole,
} from "../utils/portal-role";

type Props = {
  children: ReactNode;
  allowedRole: PortalRole;
};

export function ProtectedRoute({ children, allowedRole }: Props) {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const user = useAuthStore((state) => state.user);

  const actualRole = user ? getPortalRole(user) : null;

  useEffect(() => {
    if (!isAuthenticated || !user || !user.school) {
      router.replace("/login");
      return;
    }

    if (!actualRole) {
      router.replace("/login");
      return;
    }

    if (actualRole !== allowedRole) {
      router.replace(PORTAL_DASHBOARDS[actualRole]);
    }
  }, [
    isAuthenticated,
    user,
    actualRole,
    allowedRole,
    router,
  ]);

  if (
    !isAuthenticated ||
    !user ||
    !user.school ||
    !actualRole ||
    actualRole !== allowedRole
  ) {
    return null;
  }

  return <>{children}</>;
}