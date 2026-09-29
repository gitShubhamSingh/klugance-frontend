export const subjectQueryKeys = {
    all: ["subjects"] as const,
  
    lists: () =>
      [...subjectQueryKeys.all, "list"] as const,
  
    list: () =>
      [...subjectQueryKeys.lists()] as const,
  
    details: () =>
      [...subjectQueryKeys.all, "detail"] as const,
  
    detail: (subjectId: string) =>
      [
        ...subjectQueryKeys.details(),
        subjectId,
      ] as const,
  
    classSubjects: (classId: string) =>
      [
        "class-subjects",
        classId,
      ] as const,
  
    classSubjectDetail: (
      classSubjectId: string,
    ) =>
      [
        "class-subject-detail",
        classSubjectId,
      ] as const,
  };