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
  getNextFromLocation,
  getSafeRedirect,
} from "@/core/auth/utils/auth-routes";

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
      // Go back to the page the admin originally asked for, if it's safe.
      router.replace(
        getSafeRedirect(getNextFromLocation()),
      );
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(error),
      );
    },
  });
}
