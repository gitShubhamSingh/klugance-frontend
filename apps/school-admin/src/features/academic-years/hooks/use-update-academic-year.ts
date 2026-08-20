"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateAcademicYear } from "../api";
import type { UpdateAcademicYearPayload } from "../types";

import { academicYearKeys } from "./use-academic-years";

interface UpdateAcademicYearVariables {
  id: string;
  payload: UpdateAcademicYearPayload;
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateAcademicYearVariables) =>
      updateAcademicYear(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: academicYearKeys.list(),
        }),

        queryClient.invalidateQueries({
          queryKey: academicYearKeys.detail(
            variables.id,
          ),
        }),
      ]);

      toast.success(
        "Academic year updated successfully.",
      );
    },
  });
}