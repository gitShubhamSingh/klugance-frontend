import type { Subject } from "./index";

export interface ClassSubject {
  id: string;

  class_id: string;

  subject_id: string;

  is_mandatory: boolean;

  subject?: Subject;
}

export interface CreateClassSubjectPayload {
  class_id: string;

  subject_id: string;

  is_mandatory: boolean;
}

export interface UpdateClassSubjectPayload {
  subject_id: string;

  is_mandatory: boolean;
}