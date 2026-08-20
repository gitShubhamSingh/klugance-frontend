"use client";

import { useQuery } from "@tanstack/react-query";

import { getAcademicYears } from "../api";

export const academicYearKeys = {
  all: ["academic-years"] as const,

  list: () =>
    [...academicYearKeys.all, "list"] as const,

  detail: (id: string) =>
    [...academicYearKeys.all, "detail", id] as const,
};

export function useAcademicYears() {
  return useQuery({
    queryKey: academicYearKeys.list(),
    queryFn: getAcademicYears,
  });
}