import type { Lesson, Slot, TimetableModel } from "../types/teacher-timetable";

export type SlotState = "done" | "now" | "upcoming";

export type PeriodSlot = Extract<Slot, { kind: "period" }>;

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** "13:30" → "1:30 PM" */
export function formatTime(hhmm: string) {
  const mins = toMinutes(hhmm);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function minutesBetween(now: Date, hhmm: string) {
  return toMinutes(hhmm) - (now.getHours() * 60 + now.getMinutes());
}

export function getPeriodSlots(model: TimetableModel) {
  return model.bellSchedule.filter((s): s is PeriodSlot => s.kind === "period");
}

export function getLesson(model: TimetableModel, day: number, period: number): Lesson | undefined {
  return model.weekly[day]?.[period];
}

/** Day columns run Mon → Sat (→ Sun); `order` places `day` in that week. */
function weekOrder(day: number) {
  return day === 0 ? 7 : day;
}

export function getSlotState(slot: Slot, day: number, now: Date): SlotState {
  const today = weekOrder(now.getDay());
  const target = weekOrder(day);
  if (target < today) return "done";
  if (target > today) return "upcoming";
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins >= toMinutes(slot.end)) return "done";
  if (mins >= toMinutes(slot.start)) return "now";
  return "upcoming";
}

/** A day's periods that actually have a lesson. */
export function getDayLessons(model: TimetableModel, day: number) {
  return getPeriodSlots(model)
    .map((slot) => ({ slot, lesson: getLesson(model, day, slot.period) }))
    .filter((x): x is { slot: PeriodSlot; lesson: Lesson } => Boolean(x.lesson));
}

/** The lesson running now and the next one (searching ahead up to a week). */
export function findNowAndNext(model: TimetableModel, now: Date) {
  const today = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();

  const todays = getDayLessons(model, today);
  const current = todays.find(
    (x) => mins >= toMinutes(x.slot.start) && mins < toMinutes(x.slot.end),
  );

  let next: { day: number; slot: PeriodSlot; lesson: Lesson } | undefined;
  const laterToday = todays.find((x) => toMinutes(x.slot.start) > mins);
  if (laterToday) next = { day: today, ...laterToday };
  else {
    for (let offset = 1; offset <= 7 && !next; offset++) {
      const day = (today + offset) % 7;
      const first = getDayLessons(model, day)[0];
      if (first) next = { day, ...first };
    }
  }

  return { current, next, today };
}
