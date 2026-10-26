import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "danger";
};

/** A titled settings block. `id` is used as an in-page anchor. */
export function SettingsCard({ id, title, description, children, className, tone = "default" }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-card shadow-sm",
        tone === "danger" && "border-destructive/25",
        className,
      )}
    >
      <header className="border-b px-5 py-4 sm:px-6">
        <h2 id={`${id}-title`} className="font-semibold">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
