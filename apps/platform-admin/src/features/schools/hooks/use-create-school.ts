"use client";

import { useMutation } from "@tanstack/react-query";

import { schoolService } from "../services/school-service";

export function useCreateSchoolMutation() {
  return useMutation({
    mutationFn: schoolService.create,
  });
}