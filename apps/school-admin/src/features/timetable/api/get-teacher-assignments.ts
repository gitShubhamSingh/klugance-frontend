import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  TimetableTeacherAssignment,
} from "../types/teacher-assignment";

export async function getTeacherAssignments(): Promise<
  TimetableTeacherAssignment[]
> {
  const { data } =
    await apiClient.get<
      ApiResponse<TimetableTeacherAssignment[]>
    >(
      API_ENDPOINTS.TEACHER_ASSIGNMENTS.LIST,
    );

  return data.data ?? [];
}