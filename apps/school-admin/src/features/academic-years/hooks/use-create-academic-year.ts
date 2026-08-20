"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createAcademicYear } from "../api";
import type { CreateAcademicYearPayload } from "../types";

import { academicYearKeys } from "./use-academic-years";

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateAcademicYearPayload,
    ) => createAcademicYear(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: academicYearKeys.all,
      });

      toast.success(
        "Academic year created successfully.",
      );
    },
  });
}