"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  schoolAdminService,
} from "../services";

import type {
  SchoolAdmin,
  SchoolAdminStatus,
} from "../types";


import {
    useCallback,
  } from "react";


export function useUpdateSchoolAdminStatus() {
  const queryClient =
    useQueryClient();

  const mutation =
    useMutation({
      mutationFn: ({
        userId,
        status,
      }: {
        userId: string;
        status: SchoolAdminStatus;
      }) =>
        schoolAdminService.updateStatus(
          userId,
          status,
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

const {
    mutateAsync,
    isPending,
    error,
    } = mutation;

  const updateStatus =
    useCallback(
        async (
        admin: SchoolAdmin,
        ) => {
        if (
            admin.status !== "ACTIVE" &&
            admin.status !== "INACTIVE"
        ) {
            return;
        }

        const nextStatus:
            SchoolAdminStatus =
            admin.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        return mutateAsync({
            userId: admin.id,
            status: nextStatus,
        });
        },
        [mutateAsync],
    );

  return {
    updateStatus,

    isUpdatingStatus: isPending,
    error,
  };
}