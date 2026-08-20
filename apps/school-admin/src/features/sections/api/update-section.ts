import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  SchoolSection,
  UpdateSectionPayload,
} from "../types";

export async function updateSection(
  id: string,
  payload: UpdateSectionPayload,
): Promise<SchoolSection> {
  const { data } = await apiClient.put<
    ApiResponse<SchoolSection>
  >(
    API_ENDPOINTS.SECTIONS.UPDATE(id),
    payload,
  );

  if (!data.data) {
    throw new Error(
      "Updated section data is unavailable.",
    );
  }

  return data.data;
}