import type { ParentChild } from "@/features/parent-children";

/*
 * Mirrors backend_v2 `ParentDashboardResponse`
 * (app/modules/dashboard/schemas/parent_dashboard_response.py).
 */

/** A single period's mark. */
export type AttendanceStatusValue = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "LEAVE";

/**
 * One status per day, rolled up from its periods (backend
 * attendance_day_rules): PARTIAL = missed some periods or a half day.
 */
export type DayStatusValue = "PRESENT" | "LATE" | "PARTIAL" | "ABSENT" | "LEAVE";

export type PeriodMark = {
  period_number: number;
  period_name: string | null;
  /** 24h "HH:MM" */
  start_time: string | null;
  end_time: string | null;
  subject_name: string | null;
  status: AttendanceStatusValue;
  marked_by: string | null;
};

export type ParentExamScore = {
  exam_id: string;
  exam_name: string;
  exam_date: string | null;
  score_percent: number;
  section_average_percent: number | null;
};

export type ParentHomeworkDue = {
  id: string;
  title: string;
  subject_name: string;
  due_date: string;
};

export type ParentPeriod = {
  period_name: string;
  /** 24h "HH:MM" */
  start_time: string;
  end_time: string;
  subject_name: string;
  teacher_name: string | null;
};

export type ParentFeeSummary = {
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  invoice_count: number;
  next_due_invoice_number: string | null;
  next_due_structure_name: string | null;
  next_due_amount: number | null;
};

export type ParentTransportStop = {
  id: string;
  name: string;
  sequence: number;
  pickup_time: string;
  drop_time: string;
  is_pickup: boolean;
  is_drop: boolean;
};

export type ParentTrip = {
  id: string;
  direction: "PICKUP" | "DROP";
  status: "NOT_STARTED" | "STARTED" | "COMPLETED" | "CANCELLED";
  started_at: string | null;
  ended_at: string | null;
  boarded_at: string | null;
  dropped_at: string | null;
};

export type ParentTransport = {
  student_profile_id: string;
  assigned: boolean;
  route_code: string | null;
  route_name: string | null;
  start_location: string | null;
  end_location: string | null;
  bus_number: string | null;
  bus_registration: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  pickup_stop: ParentTransportStop | null;
  drop_stop: ParentTransportStop | null;
  stops: ParentTransportStop[];
  effective_from: string | null;
  today_trips: ParentTrip[];
};

export type ParentDashboard = {
  date: string;
  /** "YYYY-MM" */
  month: string;
  child: ParentChild;
  /** Period-based, this academic year. */
  attendance_percent: number | null;
  today_status: DayStatusValue | null;
  today_periods: PeriodMark[];
  /** "YYYY-MM-DD" → day status */
  attendance_days: Record<string, DayStatusValue>;
  avg_score_percent: number | null;
  exam_scores: ParentExamScore[];
  homework_due: ParentHomeworkDue[];
  today_schedule: ParentPeriod[];
  fees: ParentFeeSummary;
  transport: ParentTransport;
};
