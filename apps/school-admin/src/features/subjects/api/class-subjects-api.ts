import { apiClient } from "@/core/api/client";

import { API_ENDPOINTS } from "@/core/api/endpoints";

import type {
  CreateClassSubjectPayload,
  UpdateClassSubjectPayload,
} from "../types/class-subject";

import type { ClassSubject } from "../types/class-subject";

export async function getClassSubjects(
  classId: string,
): Promise<ClassSubject[]> {
  const response = await apiClient.get(
    API_ENDPOINTS.CLASS_SUBJECTS.LIST_BY_CLASS(
      classId,
    ),
  );

  return response.data.data ?? [];
}

export async function getClassSubject(
  classSubjectId: string,
): Promise<ClassSubject> {
  const response = await apiClient.get(
    API_ENDPOINTS.CLASS_SUBJECTS.DETAIL(
      classSubjectId,
    ),
  );

  return response.data.data;
}

export async function createClassSubject(
  payload: CreateClassSubjectPayload,
): Promise<ClassSubject> {
  const response = await apiClient.post(
    API_ENDPOINTS.CLASS_SUBJECTS.CREATE,
    payload,
  );

  return response.data.data;
}

export async function updateClassSubject(
  classSubjectId: string,
  payload: UpdateClassSubjectPayload,
): Promise<ClassSubject> {
  const response = await apiClient.put(
    API_ENDPOINTS.CLASS_SUBJECTS.UPDATE(
      classSubjectId,
    ),
    payload,
  );

  return response.data.data;
}

export async function deleteClassSubject(
  classSubjectId: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.CLASS_SUBJECTS.DELETE(
      classSubjectId,
    ),
  );
}