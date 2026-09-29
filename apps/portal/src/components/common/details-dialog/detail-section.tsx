"use client";

import { Separator } from "@/components/ui/separator";

import { DetailSection } from "./types";
import { DetailItemRow } from "./detail-item";

interface Props {
  section: DetailSection;
}

export function DetailsSection({
  section,
}: Props) {
  return (
    <div className="space-y-2">
      {section.title && (
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {section.title}
        </h3>
      )}

      <div className="rounded-xl border">
        <div className="divide-y">
          {section.items.map((item) => (
            <DetailItemRow
              key={item.label}
              item={item}
            />
          ))}
        </div>
      </div>

      <Separator className="hidden" />
    </div>
  );
}