"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  children: ReactNode;

  footer?: ReactNode;

  size?: "sm" | "md" | "lg" | "xl";

  loading?: boolean;

  overlayClassName?: string;
}

const dialogWidth = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-5xl",
};

export function BaseDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = "lg",
    loading = false,
    overlayClassName,
  }: BaseDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          onOpenChange(value);
        }
      }}
    >
     <DialogContent
        className={dialogWidth[size]}
        overlayClassName={overlayClassName}
        >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {children}
        </div>

        {footer}
      </DialogContent>
    </Dialog>
  );
}