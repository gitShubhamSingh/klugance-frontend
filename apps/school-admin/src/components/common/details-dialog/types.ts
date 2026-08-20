import { ReactNode } from "react";

export interface DetailItem {
  label: string;
  value: ReactNode;
}

export interface DetailSection {
  title?: string;
  items: DetailItem[];
}