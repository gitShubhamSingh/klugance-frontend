export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: "/auth/login",
      ME: "/auth/me",
      PASSWORD_RESET_REQUEST: "/auth/password-reset/request",
      PASSWORD_RESET_CONFIRM: "/auth/password-reset/confirm",
      PASSWORD_CHANGE: "/auth/change-password",
      PROFILE_PICTURE: "/auth/me/profile-picture",
    },
    DASHBOARD: {
      OVERVIEW: "/school/dashboard",
    },
    ACADEMIC_YEARS: {
        LIST: "/school/academic-years",
        CREATE: "/school/academic-years",
      
        DETAIL: (id: string) =>
          `/school/academic-years/${id}`,
      
        UPDATE: (id: string) =>
          `/school/academic-years/${id}`,
      
        DELETE: (id: string) =>
          `/school/academic-years/${id}`,
      
        SET_CURRENT: (id: string) =>
          `/school/academic-years/${id}/current`,
      },
      CLASSES: {
        LIST: "/school/classes",
        CREATE: "/school/classes",
      
        DETAIL: (id: string) =>
          `/school/classes/${id}`,
      
        UPDATE: (id: string) =>
          `/school/classes/${id}`,
      
        DELETE: (id: string) =>
          `/school/classes/${id}`,
      },
      SECTIONS: {
        LIST: "/school/sections",
        CREATE: "/school/sections",
      
        DETAIL: (id: string) =>
          `/school/sections/${id}`,
      
        UPDATE: (id: string) =>
          `/school/sections/${id}`,
      
        DELETE: (id: string) =>
          `/school/sections/${id}`,
      },
      TEACHERS: {
        LIST: "/school/teachers",
        
        BY_CLASS: (classId: string) =>
          `/school/teachers/classes/${classId}`,

        DETAIL: (id: string) =>
          `/school/teachers/${id}`,

        CREATE: "/school/teachers",

        UPDATE: (id: string) =>
          `/school/teachers/${id}`,

        DELETE: (id: string) =>
          `/school/teachers/${id}`,
      },
      STUDENTS: {
        LIST: "/school/students",
      
        CREATE: "/school/students",

        DETAIL: (id: string) =>
          `/school/students/${id}`,

        UPDATE: (id: string) =>
          `/school/students/${id}`,
      
        DELETE: (id: string) =>
          `/school/students/${id}`,

        ENROLLMENTS: (studentId: string) =>
          `/school/students/${studentId}/enrollments`,

        PARENTS: (studentId: string) =>
          `/school/students/${studentId}/parents`,

        PARENT_LINK: (studentId: string, linkId: string) =>
          `/school/students/${studentId}/parents/${linkId}`,
      },
      PARENTS: {
        LIST: "/school/parents",

        CREATE: "/school/parents",

        DETAIL: (id: string) =>
          `/school/parents/${id}`,

        UPDATE: (id: string) =>
          `/school/parents/${id}`,

        DELETE: (id: string) =>
          `/school/parents/${id}`,
      },
      SUBJECTS: {
        LIST: "/school/subjects",
      
        CREATE: "/school/subjects",
      
        DETAIL: (subjectId: string) =>
          `/school/subjects/${subjectId}`,
      
        UPDATE: (subjectId: string) =>
          `/school/subjects/${subjectId}`,
      
        DELETE: (subjectId: string) =>
          `/school/subjects/${subjectId}`,
              
        TEACHERS_BY_CLASS: (classId: string) =>
          `/school/teachers/classes/${classId}`,

        TEACHER_ASSIGNMENTS: "/school/teacher-subject-assignments",
        
        TEACHER_ASSIGNMENTS_BY_SUBJECT: (
          subjectId: string,
        ) =>
          `/school/teacher-subject-assignments/subjects/${subjectId}`,
      },
      CLASS_SUBJECTS: {
        CREATE: "/school/class-subjects",
      
        LIST_BY_CLASS: (classId: string) =>
          `/school/class-subjects/classes/${classId}`,
      
        DETAIL: (classSubjectId: string) =>
          `/school/class-subjects/${classSubjectId}`,
      
        UPDATE: (classSubjectId: string) =>
          `/school/class-subjects/${classSubjectId}`,
      
        DELETE: (classSubjectId: string) =>
          `/school/class-subjects/${classSubjectId}`,
      },
      TEACHER_ASSIGNMENTS:{
        LIST: "/school/teacher-assignments",
        CREATE: "/school/teacher-assignments",
      },
      TEACHER_CLASS_ASSIGNMENTS: {
        CREATE: "/school/teacher-class-assignments",
        LIST_BY_TEACHER: (teacherId: string) =>
          `/school/teacher-class-assignments/teachers/${teacherId}`,
        DELETE: (teacherClassId: string) =>
          `/school/teacher-class-assignments/${teacherClassId}`,
      },
      PERIODS:{
        LIST: "/school/periods",
        CREATE: "/school/periods",
        DELETE: (periodId: string) =>
          `/school/periods/${periodId}`,
      },
      TIMETABLES: {
        GRID: (classId: string, sectionId: string) =>
          `/school/timetables/grid/${classId}/${sectionId}`,
      
        CLASS_TEACHERS: (classId: string) =>
          `/school/teachers/classes/${classId}`,
        
        CREATE: "/school/timetables",
        
        DELETE: (timetableId: string) =>
          `/school/timetables/${timetableId}`,
      },

      /** Read-only view of homework set and reviewed in the portal. */
      HOMEWORK: {
        LIST: "/school/homework",
        ACTIVITY: "/school/homework/activity",
        DETAIL: (homeworkId: string) => `/school/homework/${homeworkId}`,
      },

      /** Read-only attendance marked by teachers in the portal. */
      ATTENDANCE: {
        OVERVIEW: "/school/attendance/overview",
        SECTION: (sectionId: string) =>
          `/school/attendance/sections/${sectionId}`,
      },

      /** School office chat; same shape as the portal's MESSAGES(role). */
      MESSAGES: (app: "school") => ({
        CONTACTS: `/${app}/messages/contacts`,
        CONVERSATIONS: `/${app}/messages/conversations`,
        CONVERSATION: (conversationId: string) =>
          `/${app}/messages/conversations/${conversationId}`,
        MESSAGES: (conversationId: string) =>
          `/${app}/messages/conversations/${conversationId}/messages`,
        READ: (conversationId: string) =>
          `/${app}/messages/conversations/${conversationId}/read`,
      }),
      
      
  } as const;