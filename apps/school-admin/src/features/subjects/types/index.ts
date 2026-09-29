export interface Subject {
  id: string;

  school_id?: string;

  name: string;

  code: string | null;

  description: string | null;
}

export interface CreateSubjectPayload {
  name: string;

  code?: string;

  description?: string;
}

export interface UpdateSubjectPayload {
  name: string;

  code?: string;

  description?: string;
}