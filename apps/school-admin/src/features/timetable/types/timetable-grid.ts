export type TimetableGridEntry = {
    period_id: string;
    period: string;
    start_time: string;
    end_time: string;
    subject: string | null;
    teacher: string | null;
    timetable_id: string | null;
  };
  
  export type TimetableGridData = {
    MONDAY: TimetableGridEntry[];
    TUESDAY: TimetableGridEntry[];
    WEDNESDAY: TimetableGridEntry[];
    THURSDAY: TimetableGridEntry[];
    FRIDAY: TimetableGridEntry[];
    SATURDAY: TimetableGridEntry[];
    SUNDAY: TimetableGridEntry[];
  };