"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteTeacherClassAssignment } from "../api";

export function useDeleteTeacherClassAssignment() {
  return useMutation({
    mutationFn: deleteTeacherClassAssignment,
  });
}