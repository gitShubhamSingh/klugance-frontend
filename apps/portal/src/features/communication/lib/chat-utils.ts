import type { ChatMessage, ChatPerson, ChatRole } from "../types/chat";

/** Backend timestamps are naive UTC; parse them as UTC. */
export function parseTimestamp(iso: string) {
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole calendar days between the date and today (0 = today). */
function daysAgo(date: Date, now: Date) {
  return Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
}

/** "Today", "Yesterday", a weekday this week, else "19 Oct" (+ year if not this year). */
export function dayLabel(iso: string, now = new Date()) {
  const date = parseTimestamp(iso);
  const ago = daysAgo(date, now);
  if (ago === 0) return "Today";
  if (ago === 1) return "Yesterday";
  if (ago > 1 && ago < 7) return date.toLocaleDateString("en-IN", { weekday: "long" });
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
}

export function timeLabel(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .format(parseTimestamp(iso))
    .toUpperCase();
}

/** Chat list time: the time today, otherwise the day. */
export function listTimeLabel(iso: string, now = new Date()) {
  const day = dayLabel(iso, now);
  return day === "Today" ? timeLabel(iso) : day;
}

export function groupByDay<T extends Pick<ChatMessage, "created_at">>(messages: T[]) {
  const groups: Array<{ day: string; items: T[] }> = [];
  messages.forEach((m) => {
    const day = dayLabel(m.created_at);
    const group = groups[groups.length - 1];
    if (group && group.day === day) group.items.push(m);
    else groups.push({ day, items: [m] });
  });
  return groups;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase() || "?";
}

/** "TEACHER:<user id>" or "SCHOOL" — matches the backend's side key. */
export function contactKey(person: Pick<ChatPerson, "role" | "user_id">) {
  return person.role === "SCHOOL" ? "SCHOOL" : `${person.role}:${person.user_id}`;
}

const ROLES: ChatRole[] = ["SCHOOL", "TEACHER", "PARENT", "STUDENT"];

/** Parses a ?to= deep link ("STUDENT:<id>", "SCHOOL"). */
export function parseContactKey(value: string | null): { role: ChatRole; userId: string | null } | null {
  if (!value) return null;
  const [role, userId] = value.split(":");
  if (!ROLES.includes(role as ChatRole)) return null;
  if (role === "SCHOOL") return { role: "SCHOOL", userId: null };
  return userId ? { role: role as ChatRole, userId } : null;
}

/** Link that opens the chat with someone on a portal's messages page. */
export function chatHref(page: string, person: Pick<ChatPerson, "role" | "user_id">) {
  return `${page}?to=${encodeURIComponent(contactKey(person))}`;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Only http(s) images; anything else falls back to initials. */
export function safeImageUrl(url: string | null) {
  return url && /^https?:\/\//i.test(url) ? url : null;
}
