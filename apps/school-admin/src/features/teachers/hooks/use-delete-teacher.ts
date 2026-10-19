
"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteTeacher } from "../api";
import { teacherKeys } from "./use-teachers";

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacher,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teacherKeys.all,
      });

      toast.success("Teacher deleted successfully.");
    },

    onError: (error) => {
      console.error("Failed to delete teacher:", error);

      toast.error(
        "Failed to delete teacher. Please try again.",
      );
    },
  });
}
