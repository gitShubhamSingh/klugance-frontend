import { AlertCircle, Check, CheckCheck, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { DeliveryStatus } from "../types/chat";

export type BubbleStatus = DeliveryStatus | "PENDING" | "FAILED";

const labels: Record<BubbleStatus, string> = {
  PENDING: "Sending",
  FAILED: "Not sent",
  SENT: "Sent",
  DELIVERED: "Delivered",
  READ: "Read",
};

/** WhatsApp-style ticks: clock, ✓ sent, ✓✓ delivered, blue ✓✓ read. */
export function MessageStatus({ status, className }: { status: BubbleStatus; className?: string }) {
  const Icon =
    status === "PENDING" ? Clock3 : status === "FAILED" ? AlertCircle : status === "SENT" ? Check : CheckCheck;

  return (
    <Icon
      role="img"
      aria-label={labels[status]}
      className={cn(
        "size-3.5 shrink-0",
        status === "READ" ? "text-sky-500" : status === "FAILED" ? "text-destructive" : "text-muted-foreground",
        className,
      )}
    />
  );
}
