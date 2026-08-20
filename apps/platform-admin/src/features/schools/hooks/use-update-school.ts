"use client";

import { useMutation } from "@tanstack/react-query";

import { schoolService } from "../services";
import { UpdateSchoolRequest } from "../types";

interface UpdateSchoolVariables {
  id: string;
  payload: UpdateSchoolRequest;
}

export function useUpdateSchoolMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateSchoolVariables) =>
      schoolService.update(
        id,
        payload,
      ),
  });
}