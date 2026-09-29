export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: "/auth/login",
      ME: "/auth/me",
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