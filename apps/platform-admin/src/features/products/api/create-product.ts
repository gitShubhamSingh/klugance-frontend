import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { Product } from "../types";
import { CreateProductFormValues } from "../schemas";

interface CreateProductResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: Product;
  errors: unknown[];
  meta: unknown;
  timestamp: string;
  trace_id: string | null;
  encrypted: boolean;
  algorithm: string | null;
  version: string;
}

export async function createProduct(
  payload: CreateProductFormValues,
): Promise<Product> {
  const { data } =
    await apiClient.post<CreateProductResponse>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      payload,
    );

  return data.data;
}