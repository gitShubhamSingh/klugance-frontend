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

    PARENT: {
      CHILDREN: "/parent/children",
      DASHBOARD: "/parent/dashboard",
      ATTENDANCE: "/parent/attendance",
      FEES: "/parent/fees",
      TRANSPORT: "/parent/transport",
      HOMEWORK: "/parent/homework",
      HOMEWORK_SUBMIT: (homeworkId: string) => `/parent/homework/${homeworkId}/submission`,
    },

    STUDENT: {
      PROFILE: "/student/profile",
      DASHBOARD: "/student/dashboard",
      ATTENDANCE: "/student/attendance",
      HOMEWORK: "/student/homework",
      HOMEWORK_SUBMIT: (homeworkId: string) => `/student/homework/${homeworkId}/submission`,
      EXAMS: "/student/exams",
      TIMETABLE: "/student/timetable",
    },

    /** The signed-in user's in-app notifications. */
    NOTIFICATIONS: (role: "teacher" | "parent" | "student") => ({
      LIST: `/${role}/notifications`,
      READ: (id: string) => `/${role}/notifications/${id}/read`,
      READ_ALL: `/${role}/notifications/read-all`,
    }),

    /** WhatsApp-style chat; same API for each portal role. */
    MESSAGES: (role: "teacher" | "parent" | "student") => ({
      CONTACTS: `/${role}/messages/contacts`,
      CONVERSATIONS: `/${role}/messages/conversations`,
      CONVERSATION: (conversationId: string) =>
        `/${role}/messages/conversations/${conversationId}`,
      MESSAGES: (conversationId: string) =>
        `/${role}/messages/conversations/${conversationId}/messages`,
      READ: (conversationId: string) =>
        `/${role}/messages/conversations/${conversationId}/read`,
    }),

    TEACHER: {
      DASHBOARD: "/teacher/dashboard",
      STUDENTS: "/teacher/students",
      TIMETABLE: "/teacher/timetable",
      PROFILE: "/teacher/profile",
      ATTENDANCE_TODAY: "/teacher/attendance/today",
      ATTENDANCE_REGISTERS: "/teacher/attendance/registers",
      ATTENDANCE_RECORDS: "/teacher/attendance/records",
      HOMEWORK: "/teacher/homework",
      HOMEWORK_OPTIONS: "/teacher/homework/options",
      HOMEWORK_GENERATE_QUESTIONS: "/teacher/homework/questions/generate",
      HOMEWORK_SECTION_STUDENTS: (sectionId: string) => `/teacher/homework/sections/${sectionId}/students`,
      HOMEWORK_DETAIL: (homeworkId: string) => `/teacher/homework/${homeworkId}`,
      HOMEWORK_CLOSE: (homeworkId: string) => `/teacher/homework/${homeworkId}/close`,
      HOMEWORK_REVIEW: (homeworkId: string, enrollmentId: string) =>
        `/teacher/homework/${homeworkId}/submissions/${enrollmentId}/review`,
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
      },
  } as const;