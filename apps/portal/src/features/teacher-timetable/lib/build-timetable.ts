import type { Tone } from "@/features/dashboard/lib/tones";

import type {
  Lesson,
  SchoolDay,
  Slot,
  TeacherTimetableApiResponse,
  TimetableModel,
} from "../types/teacher-timetable";

const TONES: Tone[] = ["blue", "violet", "emerald", "amber", "rose", "cyan", "orange", "indigo"];

const DAY_NUMBERS: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const ALL_DAYS: SchoolDay[] = [
  { day: 1, short: "Mon", long: "Monday" },
  { day: 2, short: "Tue", long: "Tuesday" },
  { day: 3, short: "Wed", long: "Wednesday" },
  { day: 4, short: "Thu", long: "Thursday" },
  { day: 5, short: "Fri", long: "Friday" },
  { day: 6, short: "Sat", long: "Saturday" },
  { day: 0, short: "Sun", long: "Sunday" },
];

/** Gaps of at least this many minutes between periods show as a break row. */
const MIN_BREAK_MINUTES = 5;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/**
 * Turns the API's entries into the grid the components render. Sections
 * can have their own period times, so the rows are every distinct
 * start–end time the teacher teaches at, in order; gaps become breaks.
 */
export function buildTimetable(data: TeacherTimetableApiResponse): TimetableModel {
  const times = [
    ...new Map(
      data.entries.map((e) => [`${e.start_time}-${e.end_time}`, { start: e.start_time, end: e.end_time }]),
    ).values(),
  ].sort((a, b) => toMinutes(a.start) - toMinutes(b.start) || toMinutes(a.end) - toMinutes(b.end));

  const rowByTime = new Map<string, number>();
  const bellSchedule: Slot[] = [];

  times.forEach((time, index) => {
    const previous = times[index - 1];
    if (previous && toMinutes(time.start) - toMinutes(previous.end) >= MIN_BREAK_MINUTES) {
      bellSchedule.push({ kind: "break", label: "Break", start: previous.end, end: time.start });
    }
    rowByTime.set(`${time.start}-${time.end}`, index + 1);
    bellSchedule.push({ kind: "period", period: index + 1, start: time.start, end: time.end });
  });

  const toneBySection = new Map(data.sections.map((s, i) => [s.section_id, TONES[i % TONES.length]!]));

  const weekly: Record<number, Record<number, Lesson>> = {};
  for (const entry of data.entries) {
    const day = DAY_NUMBERS[entry.day_of_week];
    const row = rowByTime.get(`${entry.start_time}-${entry.end_time}`);
    if (day === undefined || row === undefined) continue;

    weekly[day] ??= {};
    // Two classes in one slot would be a timetable clash; keep the first.
    weekly[day][row] ??= {
      kind: "class",
      timetableEntryId: entry.timetable_entry_id,
      sectionId: entry.section_id,
      sectionName: `${entry.class_name} – ${entry.section_name}`,
      subject: entry.subject_name,
      periodName: entry.period_name,
      studentCount: entry.student_count,
    };
  }

  const usesSunday = Boolean(weekly[0] && Object.keys(weekly[0]).length > 0);

  return {
    academicYearName: data.academic_year_name,
    bellSchedule,
    schoolDays: ALL_DAYS.filter((d) => d.day !== 0 || usesSunday),
    weekly,
    sections: data.sections.map((s) => ({
      id: s.section_id,
      name: `${s.class_name} – ${s.section_name}`,
      shortName: `${s.class_name.replace(/^Class\s+/i, "")} – ${s.section_name}`,
      subjects: s.subjects.join(", ") || "—",
      periodsPerWeek: s.periods_per_week,
      studentCount: s.student_count,
      tone: toneBySection.get(s.section_id) ?? "indigo",
    })),
  };
}

export function sectionTone(model: TimetableModel, sectionId: string): Tone {
  return model.sections.find((s) => s.id === sectionId)?.tone ?? "indigo";
}
