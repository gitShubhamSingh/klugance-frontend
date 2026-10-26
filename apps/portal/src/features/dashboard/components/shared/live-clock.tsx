"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Running clock (hh:mm:ss AM/PM). Ticks every second on its own so the rest
 * of the dashboard doesn't re-render.
 */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return <span className={cn("invisible tabular-nums", className)}>00:00:00</span>;
  }

  const h = now.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = h >= 12 ? "PM" : "AM";

  return (
    <time
      dateTime={now.toISOString()}
      aria-live="off"
      className={cn("inline-flex items-baseline gap-1.5 font-semibold tracking-tight tabular-nums", className)}
    >
      <span>
        {pad(h12)}:{pad(now.getMinutes())}
        <span className="text-muted-foreground">:{pad(now.getSeconds())}</span>
      </span>
      <span className="text-[0.45em] font-medium text-muted-foreground">{suffix}</span>
    </time>
  );
}
