"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStudentEnrollment,
  type CreateStudentEnrollmentPayload,
} from "../api/create-student-enrollment";

import { studentKeys } from "./use-students";

type CreateStudentEnrollmentVariables = {
  studentId: string;
  payload: CreateStudentEnrollmentPayload;
};

export function useCreateStudentEnrollment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: CreateStudentEnrollmentVariables) =>
      createStudentEnrollment(
        studentId,
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
}