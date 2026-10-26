import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { HomeworkActivity, SchoolHomeworkDetail, SchoolHomeworkList } from "../types/homework";

/* Admin-only and scoped to the admin's school on the server. `date` is the
   admin's local "YYYY-MM-DD" (decides what counts as overdue). */

export async function getSchoolHomework(date: string) {
  return (await apiClient.get<ApiResponse<SchoolHomeworkList>>(API_ENDPOINTS.HOMEWORK.LIST, { params: { date } })).data.data;
}

export async function getSchoolHomeworkDetail(id: string, date: string) {
  return (await apiClient.get<ApiResponse<SchoolHomeworkDetail>>(API_ENDPOINTS.HOMEWORK.DETAIL(id), { params: { date } })).data
    .data;
}

export async function getHomeworkActivity(limit = 30) {
  return (await apiClient.get<ApiResponse<HomeworkActivity[]>>(API_ENDPOINTS.HOMEWORK.ACTIVITY, { params: { limit } })).data.data;
}
