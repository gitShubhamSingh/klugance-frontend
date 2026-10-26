"use client";

import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type SwitcherItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Shown as an icon when provided (take-attendance view). */
  state?: "done" | "now" | "pending";
};

type Props = {
  items: SwitcherItem[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
};

export function ClassSwitcher({ items, value, onChange, label = "Choose class" }: Props) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {items.map((item) => {
        const active = item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "bg-card hover:bg-muted/60",
            )}
          >
            <span className="leading-tight">
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className={cn("block text-2xs", active ? "text-background/70" : "text-muted-foreground")}>
                {item.subtitle}
              </span>
            </span>

            {item.state === "done" ? (
              <CheckCircle2
                aria-label="Submitted"
                className={cn("size-4", active ? "text-emerald-300 dark:text-emerald-600" : "text-emerald-600")}
              />
            ) : item.state === "now" ? (
              <span className="relative flex size-2" aria-label="In class now">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
            ) : item.state === "pending" ? (
              <span
                aria-label="Pending"
                className={cn("size-2 rounded-full border", active ? "border-background/60" : "border-muted-foreground/50")}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
