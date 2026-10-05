export type ClassSubject = {
    id: string;
    class_id: string;
    subject_id: string;
    is_mandatory: boolean;
    subject: {
      id: string;
      name: string;
      code: string;
      description: string | null;
    };
  };