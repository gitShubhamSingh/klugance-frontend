"use client";

import { useQuery } from "@tanstack/react-query";

import { getAcademicYear } from "../api";
import { academicYearKeys } from "./use-academic-years";

export function useAcademicYear(
  id: string | null,
) {
  return useQuery({
    queryKey: academicYearKeys.detail(id ?? ""),
    queryFn: () => getAcademicYear(id!),
    enabled: Boolean(id),
  });
}