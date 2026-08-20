"use client";

import { DetailItem } from "./types";

interface Props {
  item: DetailItem;
}

export function DetailItemRow({ item }: Props) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-6 py-3">
      <div className="text-sm font-medium text-muted-foreground">
        {item.label}
      </div>

      <div className="break-words text-sm font-medium">
        {item.value || "-"}
      </div>
    </div>
  );
}