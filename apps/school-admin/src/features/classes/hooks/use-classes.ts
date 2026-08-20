"use client";

import { useQuery } from "@tanstack/react-query";

import { getClasses } from "../api";

export const classKeys = {
  all: ["school-classes"] as const,

  lists: () =>
    [...classKeys.all, "list"] as const,

  list: (academicYearId?: string) =>
    [
      ...classKeys.lists(),
      academicYearId ?? "none",
    ] as const,

  detail: (id: string) =>
    [
      ...classKeys.all,
      "detail",
      id,
    ] as const,
};

export function useClasses(
  academicYearId?: string,
) {
  return useQuery({
    queryKey: classKeys.list(
      academicYearId,
    ),

    queryFn: () => {
      if (!academicYearId) {
        throw new Error(
          "Academic year is required to load classes.",
        );
      }

      return getClasses(
        academicYearId,
      );
    },

    enabled: Boolean(
      academicYearId,
    ),

    staleTime: 30_000,
  });
}