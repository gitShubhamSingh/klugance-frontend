import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  action,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground",
                iconClassName,
              )}
            >
              <Icon className="size-4.5" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </header>

      <div className={cn("flex-1 p-5", contentClassName)}>{children}</div>
    </section>
  );
}
