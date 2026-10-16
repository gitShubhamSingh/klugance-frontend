import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

export type CreateStudentEnrollmentPayload = {
  academic_year_id: string;
  class_id: string;
  section_id: string;
  roll_number: string;
  enrollment_date: string;
};

export type StudentEnrollment = {
  id: string;
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  roll_number: string;
  enrollment_date: string;
};

export async function createStudentEnrollment(
  studentId: string,
  payload: CreateStudentEnrollmentPayload,
): Promise<StudentEnrollment> {
  const { data } =
    await apiClient.post<
      ApiResponse<StudentEnrollment>
    >(
      API_ENDPOINTS.STUDENTS.ENROLLMENTS(
        studentId,
      ),
      payload,
    );

  if (!data.data) {
    throw new Error(
      "Student enrollment data is unavailable.",
    );
  }

  return data.data;
}