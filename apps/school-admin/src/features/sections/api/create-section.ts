import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  CreateSectionPayload,
  SchoolSection,
} from "../types";

export async function createSection(
  payload: CreateSectionPayload,
): Promise<SchoolSection> {
  const { data } = await apiClient.post<
    ApiResponse<SchoolSection>
  >(
    API_ENDPOINTS.SECTIONS.CREATE,
    payload,
  );

  if (!data.data) {
    throw new Error(
      "Created section data is unavailable.",
    );
  }

  return data.data;
}