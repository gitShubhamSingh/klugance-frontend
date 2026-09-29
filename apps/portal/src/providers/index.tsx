"use client";

import type {
  ReactNode,
} from "react";

import {
  Toaster,
} from "sonner";

import {
  AuthProvider,
} from "@/core/auth/auth-provider";

import {
  QueryProvider,
} from "./query-provider";

type Props = {
  children: ReactNode;
};

export function Providers({
  children,
}: Props) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>

      <Toaster
        richColors
        position="top-right"
      />
    </QueryProvider>
  );
}