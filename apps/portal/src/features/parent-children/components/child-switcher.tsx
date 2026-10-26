"use client";

import { InitialsAvatar } from "@/features/dashboard/components/shared/initials-avatar";
import type { Tone } from "@/features/dashboard/lib/tones";
import { cn } from "@/lib/utils";

import { childClassLabel, childName, type ParentChild } from "../types/parent-child";

const TONES: Tone[] = ["emerald", "violet", "blue", "amber", "rose", "cyan"];

/** Stable accent per child, by position in the parent's list. */
export function childTone(children: ParentChild[], child: ParentChild): Tone {
  const index = children.findIndex((c) => c.student_profile_id === child.student_profile_id);
  return TONES[Math.max(0, index) % TONES.length]!;
}

type Props = {
  options: ParentChild[];
  value: string | null;
  onChange: (studentProfileId: string) => void;
  className?: string;
};

/** Child tabs; renders nothing for a single child. */
export function ChildSwitcher({ options, value, onChange, className }: Props) {
  if (options.length < 2) return null;

  return (
    <div
      role="tablist"
      aria-label="Select child"
      className={cn("flex gap-1.5 self-start overflow-x-auto rounded-2xl border bg-card p-1.5", className)}
    >
      {options.map((c) => {
        const active = c.student_profile_id === value;
        return (
          <button
            key={c.student_profile_id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.student_profile_id)}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors",
              active ? "bg-muted" : "hover:bg-muted/50",
            )}
          >
            <InitialsAvatar name={childName(c)} tone={childTone(options, c)} size="sm" />
            <span>
              <span className="block text-sm font-medium">{c.first_name}</span>
              <span className="block text-2xs text-muted-foreground">{childClassLabel(c)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
