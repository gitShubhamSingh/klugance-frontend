"use client";

import { useMutation } from "@tanstack/react-query";

import { schoolService } from "../services";

import {
  UpdateSchoolStatusRequest,
} from "../types";

interface UpdateSchoolStatusVariables {
  id: string;
  payload: UpdateSchoolStatusRequest;
}

export function useUpdateSchoolStatusMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateSchoolStatusVariables) =>
      schoolService.updateStatus(
        id,
        payload,
      ),
  });
}