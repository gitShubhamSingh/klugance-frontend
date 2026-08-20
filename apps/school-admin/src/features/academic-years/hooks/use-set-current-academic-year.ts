"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  setCurrentAcademicYear,
} from "../api";

import {
  academicYearKeys,
} from "./use-academic-years";

export function useSetCurrentAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCurrentAcademicYear,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: academicYearKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: ["school-dashboard"],
        }),
      ]);

      toast.success(
        "Current academic year updated successfully.",
      );
    },
  });
}