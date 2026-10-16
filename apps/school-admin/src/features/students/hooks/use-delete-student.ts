
"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteStudent } from "../api/delete-student";

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (part) =>
                typeof part === "string" &&
                part.toLowerCase().includes("student"),
            ),
        }),

        queryClient.invalidateQueries({
          queryKey: ["school-dashboard"],
        }),
      ]);

      toast.success("Student deleted successfully.");
    },

    onError: (error) => {
      console.error("Failed to delete student:", error);

      toast.error(
        "Failed to delete student. Please try again.",
      );
    },
  });
}
