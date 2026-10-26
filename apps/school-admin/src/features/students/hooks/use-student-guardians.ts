"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createStudentGuardian,
  deleteStudentGuardian,
  getStudentGuardians,
  toLinkGuardianPayload,
} from "../api/guardians";

import type { GuardianFormData } from "../schemas/guardian.schema";

import { studentKeys } from "./use-students";

export const guardianKeys = {
  list: (studentId: string) =>
    [
      ...studentKeys.detail(studentId),
      "guardians",
    ] as const,
};

export function useStudentGuardians(
  studentId: string | null,
) {
  return useQuery({
    queryKey: guardianKeys.list(studentId ?? ""),

    queryFn: () => {
      if (!studentId) {
        throw new Error("Student ID is required");
      }

      return getStudentGuardians(studentId);
    },

    enabled: Boolean(studentId),
  });
}

export function useCreateStudentGuardian(
  studentId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: GuardianFormData) =>
      createStudentGuardian(
        studentId,
        toLinkGuardianPayload(values),
      ),

    onSuccess: async (guardian) => {
      await queryClient.invalidateQueries({
        queryKey: guardianKeys.list(studentId),
      });

      if (guardian.parent_account_created === false) {
        toast.success(
          "Existing parent account linked to this student.",
        );
      } else {
        toast.success("Guardian added successfully.", {
          description:
            "They can sign in to the portal with their email as the password.",
        });
      }
    },
  });
}

export function useDeleteStudentGuardian(
  studentId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guardianId: string) =>
      deleteStudentGuardian(studentId, guardianId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: guardianKeys.list(studentId),
      });

      toast.success("Guardian removed successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove guardian. Please try again.",
      );
    },
  });
}
