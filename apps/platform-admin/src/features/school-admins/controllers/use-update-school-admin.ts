"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  schoolAdminService,
} from "../services";

import type {
  UpdateSchoolAdminRequest,
} from "../types";

interface UpdateSchoolAdminVariables {
  userId: string;
  payload: UpdateSchoolAdminRequest;
}

export function useUpdateSchoolAdmin() {
  const queryClient =
    useQueryClient();

  const mutation =
    useMutation({
      mutationFn: ({
        userId,
        payload,
      }: UpdateSchoolAdminVariables) =>
        schoolAdminService.update(
          userId,
          payload,
        ),

      onSuccess: async (
        updatedAdmin,
      ) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "school-admins",
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "school-admin",
              updatedAdmin.id,
            ],
          }),
        ]);
      },
    });

  return {
    updateSchoolAdmin:
      mutation.mutateAsync,

    isUpdating:
      mutation.isPending,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}