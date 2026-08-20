"use client";

import { useQuery } from "@tanstack/react-query";

import { getSection } from "../api";
import { sectionKeys } from "./use-sections";

export function useSection(
  id: string | null,
) {
  return useQuery({
    queryKey: sectionKeys.detail(id ?? ""),
    queryFn: () => getSection(id!),
    enabled: Boolean(id),
  });
}