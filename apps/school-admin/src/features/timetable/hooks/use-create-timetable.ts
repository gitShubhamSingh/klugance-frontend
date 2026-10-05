"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTimetable,
  type CreateTimetablePayload,
} from "../api/create-timetable";

import { timetableGridKeys } from "./use-timetable-grid";

export function useCreateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTimetablePayload) =>
      createTimetable(payload),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: timetableGridKeys.grid(
          variables.class_id,
          variables.section_id,
        ),
      });
    },
  });
}