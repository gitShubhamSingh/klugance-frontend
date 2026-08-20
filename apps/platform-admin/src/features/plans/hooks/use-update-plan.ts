"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  planService,
} from "../services";

import {
  UpdatePlanRequest,
} from "../types";

interface UpdatePlanMutationVariables {
  id: string;
  payload: UpdatePlanRequest;
}

export function useUpdatePlanMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdatePlanMutationVariables) =>
      planService.update(
        id,
        payload,
      ),
  });
}