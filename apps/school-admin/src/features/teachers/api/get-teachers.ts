import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { Teacher } from "../types";

export async function getTeachers(): Promise<
  Teacher[]
> {
  const { data } =
    await apiClient.get<
      ApiResponse<Teacher[]>
    >(
      API_ENDPOINTS.TEACHERS.LIST,
    );

  return data.data ?? [];
}