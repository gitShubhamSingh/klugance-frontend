"use client";

import { useMutation } from "@tanstack/react-query";

import {
  createTeacherAssignment,
  type CreateTeacherAssignmentPayload,
} from "../api/create-teacher-assignment";

export function useCreateTeacherAssignment() {
  return useMutation({
    mutationFn: (payload: CreateTeacherAssignmentPayload) =>
      createTeacherAssignment(payload),
  });
}