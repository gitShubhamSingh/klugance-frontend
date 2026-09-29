"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getClassSubjects,
} from "../api/class-subjects-api";

import {
  subjectQueryKeys,
} from "../api/query-keys";

export function useClassSubjects(
  classId?: string,
) {
  return useQuery({
    queryKey: classId
      ? subjectQueryKeys.classSubjects(classId)
      : ["class-subjects"],

    queryFn: () =>
      getClassSubjects(classId!),

    enabled: Boolean(classId),

    staleTime: 30_000,
  });
}