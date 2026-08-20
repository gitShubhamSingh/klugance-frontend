"use client";

import { useMutation } from "@tanstack/react-query";

import { planService } from "../services";

export function useDeletePlanMutation() {
  return useMutation({
    mutationFn: (id: string) =>
      planService.delete(id),
  });
}