"use client";

import { Badge } from "@/components/ui/badge";

import type { ExamStatus } from "../types";

type Props = {
  status: ExamStatus;
};

const STATUS_CONFIG: Record<
  ExamStatus,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "destructive";
  }
> = {
  draft: {
    label: "Draft",
    variant: "secondary",
  },

  scheduled: {
    label: "Scheduled",
    variant: "outline",
  },

  ongoing: {
    label: "Ongoing",
    variant: "default",
  },

  completed: {
    label: "Completed",
    variant: "secondary",
  },

  results_ready: {
    label: "Results Ready",
    variant: "outline",
  },

  published: {
    label: "Published",
    variant: "default",
  },

  cancelled: {
    label: "Cancelled",
    variant: "destructive",
  },
};

export function ExamStatusBadge({
  status,
}: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      className="rounded-full"
    >
      {config.label}
    </Badge>
  );
}