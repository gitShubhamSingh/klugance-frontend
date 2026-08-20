"use client";

import { useQuery } from "@tanstack/react-query";

import { productService } from "../services";

export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,

  list: () =>
    [...PRODUCT_QUERY_KEYS.all, "list"] as const,

  detail: (id: string) =>
    [...PRODUCT_QUERY_KEYS.all, "detail", id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(),
    queryFn: productService.list,
  });
}