import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  icon: LucideIcon;
  /** Optional "view all" style link in the header. */
  link?: { href: string; label: string };
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Card wrapper used by every dashboard section. */
export function DashboardPanel({
  title,
  description,
  icon: Icon,
  link,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <section className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm", className)}>
      <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-semibold">{title}</h2>
            {description && (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {link && (
          <Link
            href={link.href}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {link.label}
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </header>
      <div className={cn("flex-1 p-5", contentClassName)}>{children}</div>
    </section>
  );
}

/** Inline placeholders for loading / error / empty states inside a panel. */
export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export function PanelMessage({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-xs text-xs text-muted-foreground">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-2 inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          {action.label}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
