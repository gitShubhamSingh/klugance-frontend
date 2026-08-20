"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteClass } from "../api";

import { classKeys } from "./use-classes";

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClass,

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
        "Class deleted successfully.",
      );
    },
  });
}