
"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ApiErrorDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export function ApiErrorDialog({
  open,
  title = "Something went wrong",
  message,
  onClose,
}: ApiErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>

          <DialogTitle>{title}</DialogTitle>

          <DialogDescription className="break-words">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
