"use client";

import { useCallback } from "react";

import {
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import {
  useUpdateSchoolStatusMutation,
} from "../hooks";

import { School } from "../types";

export function useUpdateSchoolStatus() {
  const queryClient =
    useQueryClient();

  const mutation =
    useUpdateSchoolStatusMutation();

  const {
    mutateAsync,
    isPending,
    variables,
  } = mutation;

  const updateStatus =
    useCallback(
      async (
        school: School,
      ) => {
        const nextStatus:
          School["status"] =
          school.status === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        try {
          await mutateAsync({
            id: school.id,

            payload: {
              status: nextStatus,
            },
          });

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [
                "schools",
              ],
            }),

            queryClient.invalidateQueries({
              queryKey: [
                "school",
                school.id,
              ],
            }),
          ]);

          toast.success(
            nextStatus === "ACTIVE"
              ? "School activated successfully."
              : "School deactivated successfully.",
          );
        } catch (error) {
          toast.error(
            getErrorMessage(error),
          );
        }
      },
      [
        mutateAsync,
        queryClient,
      ],
    );

  return {
    updateStatus,

    loading:
      isPending,

    updatingSchoolId:
      variables?.id,
  };
}