"use client";

import { useQuery } from "@tanstack/react-query";

import { getClass } from "../api";
import { classKeys } from "./use-classes";

export function useClass(
  id: string | null,
) {
  return useQuery({
    queryKey: classKeys.detail(id ?? ""),
    queryFn: () => getClass(id!),
    enabled: Boolean(id),
  });
}