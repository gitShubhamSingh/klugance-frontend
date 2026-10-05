import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { ClassSubject } from "../types/class-subject";

export async function getClassSubjects(
  classId: string,
): Promise<ClassSubject[]> {
  const { data } = await apiClient.get<
    ApiResponse<ClassSubject[]>
  >(
    API_ENDPOINTS.CLASS_SUBJECTS.LIST_BY_CLASS(
      classId,
    ),
  );

  return data.data ?? [];
}