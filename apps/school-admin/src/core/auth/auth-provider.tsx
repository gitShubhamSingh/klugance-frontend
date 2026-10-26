"use client";

import type { ReactNode } from "react";

import { useAuthBootstrap } from "./hooks/use-auth-bootstrap";
import { useSessionSync } from "./hooks/use-session-sync";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const ready = useAuthBootstrap();
  useSessionSync();

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
