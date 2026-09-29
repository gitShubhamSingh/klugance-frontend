"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getClass,
  getClasses,
} from "../api";

/* ===================================================== */
/* QUERY KEYS */
/* ===================================================== */

export const classKeys = {
  all: ["classes"] as const,

  lists: () =>
    [...classKeys.all, "list"] as const,

  list: (
    academicYearId?: string,
  ) =>
    [
      ...classKeys.lists(),
      academicYearId ?? "all",
    ] as const,

  details: () =>
    [...classKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...classKeys.details(),
      id,
    ] as const,
};

/* ===================================================== */
/* GET CLASSES */
/* ===================================================== */

export function useClasses(
  academicYearId?: string,
) {
  return useQuery({
    queryKey:
      classKeys.list(academicYearId),

    queryFn: () =>
      getClasses(academicYearId),

    enabled: Boolean(academicYearId),
  });
}

/* ===================================================== */
/* GET SINGLE CLASS */
/* ===================================================== */

export function useClass(
  id: string | null,
) {
  return useQuery({
    queryKey:
      classKeys.detail(id ?? ""),

    queryFn: () =>
      getClass(id!),

    enabled: Boolean(id),
  });
}