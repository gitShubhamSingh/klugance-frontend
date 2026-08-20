"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  schoolAdminService,
} from "../services";

export function useSchoolAdmin(
  userId: string | null,
) {
  return useQuery({
    queryKey: [
      "school-admin",
      userId,
    ],

    queryFn: () =>
      schoolAdminService.get(
        userId!,
      ),

    enabled: Boolean(userId),
  });
}