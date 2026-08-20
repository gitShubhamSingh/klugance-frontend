"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createClass } from "../api";
import type { CreateClassPayload } from "../types";

import { classKeys } from "./use-classes";

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateClassPayload,
    ) => createClass(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: classKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: ["school-dashboard"],
        }),
      ]);

      toast.success(
        "Class created successfully.",
      );
    },
  });
}