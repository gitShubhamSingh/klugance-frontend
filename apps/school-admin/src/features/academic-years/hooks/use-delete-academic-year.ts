"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAcademicYear } from "../api";

import { academicYearKeys } from "./use-academic-years";

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAcademicYear,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: academicYearKeys.all,
      });

      toast.success(
        "Academic year deleted successfully.",
      );
    },
  });
}