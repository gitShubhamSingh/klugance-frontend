"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  schoolAdminService,
} from "../services";

export function useDeleteSchoolAdmin() {
  const queryClient =
    useQueryClient();

  const mutation =
    useMutation({
      mutationFn: (
        userId: string,
      ) =>
        schoolAdminService.delete(
          userId,
        ),

      onSuccess: async (
        _data,
        userId,
      ) => {
        await queryClient.invalidateQueries({
          queryKey: [
            "school-admins",
          ],
        });

        queryClient.removeQueries({
          queryKey: [
            "school-admin",
            userId,
          ],
        });
      },
    });

  return {
    deleteSchoolAdmin:
      mutation.mutateAsync,

    isDeleting:
      mutation.isPending,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}