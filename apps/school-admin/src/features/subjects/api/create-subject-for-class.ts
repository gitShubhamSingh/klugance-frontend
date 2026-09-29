import {
    createClassSubject,
  } from "./class-subjects-api";
  
  import {
    createSubject,
  } from "./subjects-api";
  
  
  export interface CreateSubjectForClassPayload {
    class_id: string;
  
    name: string;
  
    code?: string;
  
    description?: string;
  
    is_mandatory: boolean;
  }
  
  
  export interface CreateSubjectForClassResult {
    subjectId: string;
  
    classSubjectId: string;
  }
  
  
  export async function createSubjectForClass(
    payload: CreateSubjectForClassPayload,
  ): Promise<CreateSubjectForClassResult> {
  
    /* =============================================== */
    /* STEP 1: CREATE SUBJECT */
    /* =============================================== */
  
    const subject =
      await createSubject({
        name: payload.name,
  
        code: payload.code,
  
        description: payload.description,
      });
  
  
    /* =============================================== */
    /* STEP 2: ASSIGN SUBJECT TO CLASS */
    /* =============================================== */
  
    const classSubject =
      await createClassSubject({
        class_id: payload.class_id,
  
        subject_id: subject.id,
  
        is_mandatory: payload.is_mandatory,
      });
  
  
    /* =============================================== */
    /* SUCCESS */
    /* =============================================== */
  
    return {
      subjectId: subject.id,
  
      classSubjectId: classSubject.id,
    };
  }