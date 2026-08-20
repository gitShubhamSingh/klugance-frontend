import { ReactNode } from "react";

import {
  ColumnDef,
  Table,
} from "@tanstack/react-table";

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];

  /**
   * Right side toolbar actions.
   * Example:
   * - Add School
   * - Add Teacher
   * - Export
   * - Import
   */
  toolbarActions?: ReactNode;
};

export type ToolbarProps<TData> = {
  table: Table<TData>;

  /**
   * Custom actions rendered on the right side
   * of the toolbar.
   */
  actions?: ReactNode;
};