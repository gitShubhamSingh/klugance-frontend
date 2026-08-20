import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  CreateClassPayload,
  SchoolClass,
} from "../types";

export async function createClass(
  payload: CreateClassPayload,
): Promise<SchoolClass> {
  const { data } = await apiClient.post<
    ApiResponse<SchoolClass>
  >(
    API_ENDPOINTS.CLASSES.CREATE,
    payload,
  );

  if (!data.data) {
    throw new Error(
      "Created class data is unavailable.",
    );
  }

  return data.data;
}