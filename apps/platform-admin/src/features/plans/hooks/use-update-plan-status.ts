"use client";

import { useMutation } from "@tanstack/react-query";

import { planService } from "../services";

import {
  UpdatePlanStatusRequest,
} from "../types";

interface UpdatePlanStatusVariables {
  id: string;
  payload: UpdatePlanStatusRequest;
}

export function useUpdatePlanStatusMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdatePlanStatusVariables) =>
      planService.updateStatus(
        id,
        payload,
      ),
  });
}