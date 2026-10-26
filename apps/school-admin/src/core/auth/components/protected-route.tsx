"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "../store/auth.store";
import { buildLoginPath } from "../utils/auth-routes";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const signedIn = isAuthenticated && Boolean(user?.school);

  useEffect(() => {
    if (!signedIn) {
      // Remember where the admin was going so login can bring them back.
      router.replace(buildLoginPath(`${pathname}${window.location.search}`));
    }
  }, [signedIn, pathname, router]);

  if (!signedIn) {
    return null;
  }

  return <>{children}</>;
}
