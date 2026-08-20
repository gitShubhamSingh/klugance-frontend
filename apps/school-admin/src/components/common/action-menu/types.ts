import { LucideIcon } from "lucide-react";

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
};