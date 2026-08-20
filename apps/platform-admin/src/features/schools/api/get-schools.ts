import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api";

import type {ApiResponse} from "@/core/api/types/api-response"

import type { School } from "../types/school";

export async function getSchools(): Promise<School[]> {
  const { data } = await apiClient.get<ApiResponse<School[]>>(
    API_ENDPOINTS.SCHOOLS.LIST,
  );

  return data.data;
}