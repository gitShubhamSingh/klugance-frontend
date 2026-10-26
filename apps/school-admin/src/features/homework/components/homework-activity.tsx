"use client";

import { BookPlus, CheckCircle2, Inbox, Send, XCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useHomeworkActivity } from "../hooks/use-homework";
import { formatWhen } from "../lib/homework-utils";
import type { HomeworkActivity } from "../types/homework";

const STYLE: Record<HomeworkActivity["type"], { icon: typeof Send; className: string }> = {
  ASSIGNED: { icon: BookPlus, className: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  SUBMITTED: { icon: Send, className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  CHECKED: { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  REJECTED: { icon: XCircle, className: "bg-rose-500/10 text-rose-700 dark:text-rose-300" },
};

function sentence(e: HomeworkActivity) {
  const who = e.actor_name ?? "Someone";
  switch (e.type) {
    case "ASSIGNED":
      return `${who} set homework ${e.detail ?? ""}`.trim();
    case "SUBMITTED":
      return e.actor_role === "PARENT" ? `${who} (parent) submitted for ${e.student_name}` : `${e.student_name ?? who} submitted`;
    case "CHECKED":
      return `${who} checked ${e.student_name}'s work${e.detail ? ` · ${e.detail}` : ""}`;
    case "REJECTED":
      return `${who} rejected ${e.student_name}'s work${e.detail ? `: “${e.detail}”` : ""}`;
  }
}

/** Latest homework events across the school. */
export function HomeworkActivityFeed({ onOpen }: { onOpen: (homeworkId: string) => void }) {
  const query = useHomeworkActivity();
  const events = query.data ?? [];

  return (
    <section className="rounded-xl border bg-card" aria-label="Recent homework activity">
      <div className="border-b px-4 py-3">
        <h2 className="font-semibold">Recent activity</h2>
        <p className="text-xs text-muted-foreground">Set, handed in, checked and rejected — across the school.</p>
      </div>
      {query.isLoading ? (
        <div className="space-y-2 p-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center p-8 text-center">
          <Inbox className="size-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No homework activity yet.</p>
        </div>
      ) : (
        <ol className="max-h-[640px] divide-y overflow-y-auto">
          {events.map((e, i) => {
            const style = STYLE[e.type];
            const Icon = style.icon;
            return (
              <li key={`${e.type}-${e.homework_id}-${e.at}-${i}`}>
                <button
                  type="button"
                  onClick={() => onOpen(e.homework_id)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg", style.className)}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{sentence(e)}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {e.title} · {e.subject_name} · {e.class_name} – {e.section_name}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{formatWhen(e.at)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
