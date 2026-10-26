import type { Tone } from "@/features/dashboard/lib/tones";

import type {
  ClassSection,
  Gender,
  TeacherStudent,
  TeacherStudentsApiResponse,
  TeacherStudentsApiSection,
  TeacherStudentsApiStudent,
  TeacherStudentsData,
} from "../types/teacher-students";

const TONES: Tone[] = ["blue", "violet", "emerald", "amber", "rose", "cyan", "orange", "indigo"];

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const GENDERS: Record<string, Gender> = { MALE: "M", FEMALE: "F", OTHER: "O" };

function round(value: number | null) {
  return value === null ? null : Math.round(value);
}

/** "Mon – Sat · 8 periods/week", "Mon, Wed · 2 periods/week" */
function formatSchedule(section: TeacherStudentsApiSection) {
  const indexes = section.schedule_days
    .map((day) => DAYS.indexOf(day))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);

  if (indexes.length === 0) return "Not on the timetable yet";

  const contiguous = indexes.every((day, i) => i === 0 || day === indexes[i - 1]! + 1);
  const days =
    contiguous && indexes.length > 2
      ? `${DAY_SHORT[indexes[0]!]} – ${DAY_SHORT[indexes[indexes.length - 1]!]}`
      : indexes.map((i) => DAY_SHORT[i]).join(", ");

  const periods = section.periods_per_week;
  return `${days} · ${periods} ${periods === 1 ? "period" : "periods"}/week`;
}

/** Birthday label when it falls within 7 days from `today` ("YYYY-MM-DD"). */
function upcomingBirthday(dateOfBirth: string | null, today: string) {
  if (!dateOfBirth) return null;

  const [, month, day] = dateOfBirth.split("-").map(Number);
  const [year, todayMonth, todayDay] = today.split("-").map(Number);
  if (!month || !day || !year || !todayMonth || !todayDay) return null;

  const start = new Date(year, todayMonth - 1, todayDay);
  for (const y of [year, year + 1]) {
    const next = new Date(y, month - 1, day);
    const diff = Math.round((next.getTime() - start.getTime()) / 86_400_000);
    if (diff >= 0 && diff < 7) {
      return next.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  }
  return null;
}

function toSection(section: TeacherStudentsApiSection, index: number): ClassSection {
  return {
    id: section.section_id,
    name: `${section.class_name} – ${section.section_name}`,
    shortName: `${section.class_name.replace(/^Class\s+/i, "")} – ${section.section_name}`,
    subject: section.subjects.join(", ") || "—",
    schedule: formatSchedule(section),
    strength: section.student_count,
    tone: TONES[index % TONES.length]!,
  };
}

function toStudent(student: TeacherStudentsApiStudent, today: string): TeacherStudent {
  return {
    id: student.student_profile_id,
    userId: student.user_id,
    enrollmentId: student.enrollment_id,
    name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" "),
    rollNo: student.roll_number,
    admissionNumber: student.admission_number,
    sectionId: student.section_id,
    gender: student.gender ? (GENDERS[student.gender] ?? null) : null,

    attendance: round(student.attendance_percent),
    avgScore: round(student.avg_score_percent),
    trend: round(student.score_trend),
    homeworkRate: round(student.homework_rate),
    presentToday: student.present_today,

    parentName: student.guardian?.name ?? null,
    parentPhone: student.guardian?.mobile_number ?? null,
    parentUserId: student.guardian?.user_id ?? null,

    birthday: upcomingBirthday(student.date_of_birth, today),

    scores: student.scores.map((score) => ({
      test: score.exam_name,
      score: Math.round(score.score_percent),
    })),
  };
}

export function mapTeacherStudents(data: TeacherStudentsApiResponse): TeacherStudentsData {
  return {
    date: data.date,
    academicYearName: data.academic_year_name,
    sections: data.sections.map(toSection),
    students: data.students.map((student) => toStudent(student, data.date)),
  };
}
