"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSection,
  getSections,
} from "../api";

export const sectionKeys = {
  all: ["school-sections"] as const,

  lists: () =>
    [...sectionKeys.all, "list"] as const,

  list: (classId?: string) =>
    [
      ...sectionKeys.lists(),
      classId ?? "none",
    ] as const,

  detail: (id: string) =>
    [
      ...sectionKeys.all,
      "detail",
      id,
    ] as const,
};

export function useSections(
  classId?: string,
) {
  return useQuery({
    queryKey: sectionKeys.list(
      classId,
    ),

    queryFn: () => {
      if (!classId) {
        throw new Error(
          "Class is required to load sections.",
        );
      }

      return getSections(classId);
    },

    enabled: Boolean(classId),

    staleTime: 30_000,
  });
}

export function useSection(
  id: string | null,
) {
  return useQuery({
    queryKey: sectionKeys.detail(
      id ?? "",
    ),

    queryFn: () => {
      if (!id) {
        throw new Error(
          "Section ID is required.",
        );
      }

      return getSection(id);
    },

    enabled: Boolean(id),

    staleTime: 30_000,
  });
}