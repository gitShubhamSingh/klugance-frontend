import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { TeacherOwnProfile } from "../types/teacher-profile";

/** The signed-in teacher's own employment record. */
export async function getTeacherProfile(): Promise<TeacherOwnProfile> {
  const { data } = await apiClient.get<ApiResponse<TeacherOwnProfile>>(
    API_ENDPOINTS.TEACHER.PROFILE,
  );

  return data.data;
}
