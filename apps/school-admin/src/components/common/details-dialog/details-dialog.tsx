"use client";

import { BaseDialog } from "@/components/common/dialog";

import { DetailSection } from "./types";
import { DetailsSection } from "./detail-section";

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;

  sections: DetailSection[];
}

export function DetailsDialog({
  open,
  onOpenChange,
  title,
  sections,
}: DetailsDialogProps) {
  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="lg"
    >
      {sections.map((section, index) => (
        <DetailsSection
          key={index}
          section={section}
        />
      ))}
    </BaseDialog>
  );
}