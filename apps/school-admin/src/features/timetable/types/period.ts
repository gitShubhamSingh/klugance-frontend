export type Period = {
    id: string;
    school_id: string;
    name: string;
    start_time: string;
    end_time: string;
  };
  
  export type CreatePeriodPayload = {
    name: string;
    start_time: string;
    end_time: string;
    class_id: string;
    section_id: string;
  };