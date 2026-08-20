"use client";

import { useMutation } from "@tanstack/react-query";

import { productService } from "../services";

export function useDeleteProductMutation() {
  return useMutation({
    mutationFn: (id: string) =>
      productService.delete(id),
  });
}