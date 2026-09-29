"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAuthStore,
} from "../store/auth.store";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children,
}: Props) {
  const router = useRouter();

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  const user =
    useAuthStore(
      (state) => state.user,
    );

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user ||
      !user.school
    ) {
      router.replace("/login");
    }
  }, [
    isAuthenticated,
    user,
    router,
  ]);

  if (
    !isAuthenticated ||
    !user ||
    !user.school
  ) {
    return null;
  }

  return <>{children}</>;
}