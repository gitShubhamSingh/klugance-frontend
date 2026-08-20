import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { Product } from "../types";

interface GetProductResponse {
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

export async function getProduct(
  id: string,
): Promise<Product> {
  const { data } =
    await apiClient.get<GetProductResponse>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id),
    );

  return data.data;
}