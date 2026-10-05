"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPeriod,
  type CreatePeriodPayload,
} from "../api";

import { periodKeys } from "./use-periods";
import { timetableGridKeys } from "./use-timetable-grid";

export function useCreatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreatePeriodPayload,
    ) => createPeriod(payload),

    onSuccess: async (_, variables) => {
      // Invalidate period queries if they are used elsewhere.
      await queryClient.invalidateQueries({
        queryKey: periodKeys.all,
      });

      // Refresh the timetable grid for the
      // currently selected class + section.
      await queryClient.invalidateQueries({
        queryKey: timetableGridKeys.grid(
          variables.class_id,
          variables.section_id,
        ),
      });
    },
  });
}