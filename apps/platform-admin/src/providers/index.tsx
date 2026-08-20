"use client";

import { ReactNode, useEffect } from "react";

import { Toaster } from "sonner";

import { QueryProvider } from "./query-provider";

import { AuthProvider } from "@/core/auth/auth-provider";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>

      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}