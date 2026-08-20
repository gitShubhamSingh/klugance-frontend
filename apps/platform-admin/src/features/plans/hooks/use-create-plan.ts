"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  planService,
} from "../services";

export function useCreatePlanMutation() {
  return useMutation({
    mutationFn: planService.create,
  });
}