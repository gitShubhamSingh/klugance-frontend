"use client";

import { useQuery } from "@tanstack/react-query";

import { schoolService } from "../services/school-service";

export function useSchool(
  id?: string,
) {
  return useQuery({
    queryKey: ["school", id],

    queryFn: () =>
      schoolService.get(id!),

    enabled: !!id,
  });
}