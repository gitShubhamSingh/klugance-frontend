import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { SchoolSection } from "../types";

export async function getSections(
  classId: string,
): Promise<SchoolSection[]> {
  if (!classId) {
    return [];
  }

  const { data } =
    await apiClient.get<
      ApiResponse<SchoolSection[]>
    >(
      API_ENDPOINTS.SECTIONS.LIST,
      {
        params: {
          class_id: classId,
        },
      },
    );

  return data.data ?? [];
}

export async function getSection(
  id: string,
): Promise<SchoolSection> {
  if (!id) {
    throw new Error(
      "Section ID is required.",
    );
  }

  const { data } =
    await apiClient.get<
      ApiResponse<SchoolSection>
    >(
      API_ENDPOINTS.SECTIONS.DETAIL(id),
    );

  if (!data.data) {
    throw new Error(
      "Section data is unavailable.",
    );
  }

  return data.data;
}