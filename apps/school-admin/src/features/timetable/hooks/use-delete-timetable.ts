"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteTimetable } from "../api/delete-timetable";
import { timetableGridKeys } from "./use-timetable-grid";

type DeleteTimetableVariables = {
  timetableId: string;
  classId: string;
  sectionId: string;
};

export function useDeleteTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timetableId,
    }: DeleteTimetableVariables) =>
      deleteTimetable(timetableId),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey: timetableGridKeys.grid(
          variables.classId,
          variables.sectionId,
        ),
      });

      toast.success(
        "Timetable entry deleted successfully.",
      );
    },

    onError: (error) => {
      console.error(
        "Failed to delete timetable entry:",
        error,
      );

      toast.error(
        "Failed to delete timetable entry. Please try again.",
      );
    },
  });
}