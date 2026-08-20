"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createSection } from "../api";
import type { CreateSectionPayload } from "../types";

import { sectionKeys } from "./use-sections";

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateSectionPayload,
    ) => createSection(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: sectionKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: ["school-dashboard"],
        }),
      ]);

      toast.success(
        "Section created successfully.",
      );
    },
  });
}