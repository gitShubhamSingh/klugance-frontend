
"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deletePeriod } from "../api/delete-period";
import { timetableGridKeys } from "./use-timetable-grid";

export function useDeletePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePeriod,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: timetableGridKeys.all,
      });

      toast.success("Period deleted successfully.");
    },

    onError: (error) => {
      console.error("Failed to delete period:", error);

      toast.error(
        "Failed to delete period. Please try again.",
      );
    },
  });
}
