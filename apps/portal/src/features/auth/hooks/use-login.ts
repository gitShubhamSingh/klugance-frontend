
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { sessionService } from "@/core/auth/session/session.service";
import {
  getPortalRole,
  PORTAL_DASHBOARDS,
} from "@/core/auth/utils/portal-role";
import type { LoginFormData } from "../schemas/login.schema";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginFormData) => {
      return sessionService.login(
        payload.email,
        payload.password,
      );
    },

    onSuccess: (user) => {
      const role = getPortalRole(user);

      if (!role) {
        sessionService.clear();
        router.replace("/login");
        return;
      }

      router.replace(PORTAL_DASHBOARDS[role]);
    },
  });
}
