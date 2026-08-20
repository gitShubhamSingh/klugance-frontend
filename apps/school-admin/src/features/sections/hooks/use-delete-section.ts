"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSection } from "../api";

import { sectionKeys } from "./use-sections";

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSection,

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
        "Section deleted successfully.",
      );
    },
  });
}