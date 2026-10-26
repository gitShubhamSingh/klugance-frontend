import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";
import type { StudentHomework, StudentHomeworkItem, SubmitHomeworkPayload } from "@/features/student/types/student";

import type {
  CreateHomeworkPayload,
  GeneratedQuestionPaper,
  GenerateQuestionsPayload,
  HomeworkClassOption,
  HomeworkStudentOption,
  ReviewPayload,
  TeacherHomework,
  TeacherHomeworkDetail,
} from "../types/homework";

/* Teacher endpoints are scoped server-side to the signed-in teacher's own
   classes; child endpoints to the signed-in student or a linked child. */

const T = API_ENDPOINTS.TEACHER;

export async function getHomeworkOptions() {
  return (await apiClient.get<ApiResponse<HomeworkClassOption[]>>(T.HOMEWORK_OPTIONS)).data.data;
}

export async function getSectionStudents(sectionId: string) {
  return (await apiClient.get<ApiResponse<HomeworkStudentOption[]>>(T.HOMEWORK_SECTION_STUDENTS(sectionId))).data.data;
}

export async function getTeacherHomework() {
  return (await apiClient.get<ApiResponse<TeacherHomework[]>>(T.HOMEWORK)).data.data;
}

export async function getTeacherHomeworkDetail(id: string) {
  return (await apiClient.get<ApiResponse<TeacherHomeworkDetail>>(T.HOMEWORK_DETAIL(id))).data.data;
}

export async function createHomework(payload: CreateHomeworkPayload) {
  return (await apiClient.post<ApiResponse<TeacherHomeworkDetail[]>>(T.HOMEWORK, payload)).data.data;
}

/** Drafts a question paper with AI. Nothing is stored until publishing is built. */
export async function generateQuestions(payload: GenerateQuestionsPayload) {
  return (await apiClient.post<ApiResponse<GeneratedQuestionPaper>>(T.HOMEWORK_GENERATE_QUESTIONS, payload)).data.data;
}

export async function reviewSubmission(homeworkId: string, enrollmentId: string, payload: ReviewPayload) {
  return (await apiClient.put<ApiResponse<TeacherHomeworkDetail>>(T.HOMEWORK_REVIEW(homeworkId, enrollmentId), payload)).data
    .data;
}

export async function closeHomework(id: string) {
  return (await apiClient.post<ApiResponse<TeacherHomeworkDetail>>(T.HOMEWORK_CLOSE(id))).data.data;
}

export async function cancelHomework(id: string) {
  await apiClient.delete(T.HOMEWORK_DETAIL(id));
}

/* ── student / parent ── */

export type ChildHomeworkSource = { role: "student" } | { role: "parent"; studentId: string };

export async function getChildHomework(source: ChildHomeworkSource, date: string) {
  const url = source.role === "student" ? API_ENDPOINTS.STUDENT.HOMEWORK : API_ENDPOINTS.PARENT.HOMEWORK;
  const params = source.role === "student" ? { date } : { date, student_id: source.studentId };
  return (await apiClient.get<ApiResponse<StudentHomework>>(url, { params })).data.data;
}

export async function submitChildHomework(
  source: ChildHomeworkSource,
  homeworkId: string,
  payload: SubmitHomeworkPayload,
  date: string,
) {
  const url =
    source.role === "student"
      ? API_ENDPOINTS.STUDENT.HOMEWORK_SUBMIT(homeworkId)
      : API_ENDPOINTS.PARENT.HOMEWORK_SUBMIT(homeworkId);
  const params = source.role === "student" ? { date } : { date, student_id: source.studentId };
  return (await apiClient.post<ApiResponse<StudentHomeworkItem>>(url, payload, { params })).data.data;
}
