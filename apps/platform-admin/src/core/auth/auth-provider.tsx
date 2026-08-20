"use client";

import type { ReactNode } from "react";

import { useAuthBootstrap } from "./hooks/use-auth-bootstrap";

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const ready = useAuthBootstrap();

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}