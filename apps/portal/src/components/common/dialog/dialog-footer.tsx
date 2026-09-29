"use client";

import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  onCancel?: () => void;
  onSubmit?: () => void;

  cancelLabel?: string;
  submitLabel?: string;

  submitVariant?:
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "link";

  loading?: boolean;

  cancelDisabled?: boolean;
  submitDisabled?: boolean;
}

export function DialogFooter({
  onCancel,
  onSubmit,

  cancelLabel = "Cancel",
  submitLabel = "Save",

  submitVariant = "default",

  loading = false,

  cancelDisabled = false,
  submitDisabled = false,
}: DialogFooterProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t pt-6">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={loading || cancelDisabled}
      >
        {cancelLabel}
      </Button>

      <Button
        variant={submitVariant}
        onClick={onSubmit}
        disabled={loading || submitDisabled}
      >
        {loading ? "Please wait..." : submitLabel}
      </Button>
    </div>
  );
}