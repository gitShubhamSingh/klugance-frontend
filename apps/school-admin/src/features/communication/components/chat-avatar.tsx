import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { initials, safeImageUrl } from "../lib/chat-utils";
import type { ChatPerson, ChatRole } from "../types/chat";

const roleTint: Record<ChatRole, string> = {
  SCHOOL: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  TEACHER: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  PARENT: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  STUDENT: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
};

export function ChatAvatar({
  person,
  className,
}: {
  person: Pick<ChatPerson, "role" | "name" | "avatar_url">;
  className?: string;
}) {
  const image = safeImageUrl(person.avatar_url);

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold",
        roleTint[person.role],
        className,
      )}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" />
      ) : person.role === "SCHOOL" ? (
        <Building2 className="size-[45%]" />
      ) : (
        initials(person.name)
      )}
    </span>
  );
}

export function RoleBadge({ role, className }: { role: ChatRole; className?: string }) {
  const label = role === "SCHOOL" ? "Office" : role.charAt(0) + role.slice(1).toLowerCase();
  return (
    <span className={cn("shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium", roleTint[role], className)}>
      {label}
    </span>
  );
}
