"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "sonner";

import {
  sessionService,
} from "@/core/auth/session/session.service";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import type {
  LoginFormData,
} from "../schemas/login.schema";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (
      payload: LoginFormData,
    ) =>
      sessionService.login(
        payload.email,
        payload.password,
      ),

    onSuccess: () => {
      router.replace(
        "/dashboard",
      );
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(error),
      );
    },
  });
}