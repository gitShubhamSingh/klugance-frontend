import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  SchoolClass,
  UpdateClassPayload,
} from "../types";

export async function updateClass(
  id: string,
  payload: UpdateClassPayload,
): Promise<SchoolClass> {
  const { data } = await apiClient.put<
    ApiResponse<SchoolClass>
  >(
    API_ENDPOINTS.CLASSES.UPDATE(id),
    payload,
  );

  if (!data.data) {
    throw new Error(
      "Updated class data is unavailable.",
    );
  }

  return data.data;
}