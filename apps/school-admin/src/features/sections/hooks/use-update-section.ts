"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSection } from "../api";
import type { UpdateSectionPayload } from "../types";

import { sectionKeys } from "./use-sections";

interface UpdateSectionVariables {
  id: string;
  payload: UpdateSectionPayload;
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateSectionVariables) =>
      updateSection(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: sectionKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: sectionKeys.detail(
            variables.id,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: ["school-dashboard"],
        }),
      ]);

      toast.success(
        "Section updated successfully.",
      );
    },
  });
}