"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateClass } from "../api";
import type { UpdateClassPayload } from "../types";

import { classKeys } from "./use-classes";

interface UpdateClassVariables {
  id: string;
  payload: UpdateClassPayload;
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateClassVariables) =>
      updateClass(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: classKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: classKeys.detail(
            variables.id,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: ["school-dashboard"],
        }),
      ]);

      toast.success(
        "Class updated successfully.",
      );
    },
  });
}