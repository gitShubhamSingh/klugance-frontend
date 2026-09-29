"use client";

import { useMutation } from "@tanstack/react-query";

import {
  createTeacherClassAssignment,
} from "../api";

export function useCreateTeacherClassAssignment() {
  return useMutation({
    mutationFn: createTeacherClassAssignment,
  });
}