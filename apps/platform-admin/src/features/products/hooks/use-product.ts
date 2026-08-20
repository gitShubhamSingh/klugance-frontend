"use client";

import { useQuery } from "@tanstack/react-query";

import { productService } from "../services";
import { PRODUCT_QUERY_KEYS } from "./use-products";

export function useProduct(
  id?: string,
) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(
      id ?? "",
    ),

    queryFn: () =>
      productService.get(id!),

    enabled: !!id,
  });
}