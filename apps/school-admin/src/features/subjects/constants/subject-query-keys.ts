export const subjectQueryKeys = {
    all: ["subjects"] as const,
  
    list: () =>
      [...subjectQueryKeys.all, "list"] as const,
  
    detail: (subjectId: string) =>
      [
        ...subjectQueryKeys.all,
        "detail",
        subjectId,
      ] as const,
  
    classSubjects: (classId: string) =>
      [
        ...subjectQueryKeys.all,
        "class-subjects",
        classId,
      ] as const,
  };