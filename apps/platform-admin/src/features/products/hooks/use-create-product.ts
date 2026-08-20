"use client";

import { useMutation } from "@tanstack/react-query";

import { productService } from "../services";

export function useCreateProductMutation() {
  return useMutation({
    mutationFn: productService.create,
  });
}