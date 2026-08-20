import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { Product } from "../types";

interface GetProductsResponse {
  success: boolean;
  status_code: number;
  message: string;

  data: Product[];

  errors: unknown[];
  meta: unknown;

  timestamp: string;
  trace_id: string | null;

  encrypted: boolean;
  algorithm: string | null;
  version: string;
}

export async function getProducts(): Promise<Product[]> {
  const { data } =
    await apiClient.get<GetProductsResponse>(
      API_ENDPOINTS.PRODUCTS.LIST,
    );

  return data.data;
}