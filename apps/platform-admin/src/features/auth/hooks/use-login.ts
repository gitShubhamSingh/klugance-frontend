"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { sessionService } from "@/core/auth/session/session.service";
import type { LoginFormData } from "../schemas/login.schema";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginFormData) => {
      console.log("Submitting login:", payload);

      return sessionService.login(
        payload.email,
        payload.password,
      );
    },

    onSuccess: () => {
      console.log("Login successful");
      router.replace("/dashboard");
    },

    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}