import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type {
  StudentAttendance,
  StudentDashboard,
  StudentExams,
  StudentHomework,
  StudentTimetable,
} from "../types/student";

/* The server resolves the student from the session; these only ever return
   the signed-in student's own data. `date` is the local "YYYY-MM-DD". */

async function get<T>(url: string, params?: Record<string, string>): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
  return data.data;
}

export function getStudentDashboard(date: string) {
  return get<StudentDashboard>(API_ENDPOINTS.STUDENT.DASHBOARD, { date });
}

export function getStudentAttendance(date: string, month: string) {
  return get<StudentAttendance>(API_ENDPOINTS.STUDENT.ATTENDANCE, { date, month });
}

export function getStudentHomework(date: string) {
  return get<StudentHomework>(API_ENDPOINTS.STUDENT.HOMEWORK, { date });
}

export function getStudentExams(date: string) {
  return get<StudentExams>(API_ENDPOINTS.STUDENT.EXAMS, { date });
}

export function getStudentTimetable() {
  return get<StudentTimetable>(API_ENDPOINTS.STUDENT.TIMETABLE);
}
