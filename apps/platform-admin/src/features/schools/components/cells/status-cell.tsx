"use client";

import { Badge } from "@/components/ui/badge";

interface Props {
  active: boolean;
}

export function StatusCell({
  active,
}: Props) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}