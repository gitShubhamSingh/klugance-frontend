"use client";

import { useQuery } from "@tanstack/react-query";

import { getParentFees } from "../api/get-parent-fees";

export const parentFeeKeys = {
  all: ["parent-fees"] as const,
  child: (studentId: string) => [...parentFeeKeys.all, studentId] as const,
};

export function useParentFees(studentId: string | null) {
  return useQuery({
    queryKey: parentFeeKeys.child(studentId ?? ""),
    queryFn: () => getParentFees(studentId!),
    enabled: Boolean(studentId),
  });
}
