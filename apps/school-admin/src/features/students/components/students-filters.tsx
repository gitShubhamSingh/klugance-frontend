"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  status: "all" | "active" | "inactive";
  onStatusChange: (
    value: "all" | "active" | "inactive",
  ) => void;

  totalStudents: number;
  filteredStudents: number;
};

export function StudentsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  totalStudents,
  filteredStudents,
}: Props) {
  return (
    <div className="space-y-6">
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">

      <div className="flex flex-col gap-3 sm:flex-row">
      {/* Search */}

      <div className="relative w-full sm:w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search students..."
          className="pl-9"
        />
      </div>

      {/* Status */}

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(
            value as
              | "all"
              | "active"
              | "inactive",
          )
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All Students" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Students
          </SelectItem>

          <SelectItem value="active">
            Active Students
          </SelectItem>

          <SelectItem value="inactive">
            Inactive Students
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

      {/* Count */}

      <div className="text-sm text-muted-foreground">
        
        Showing{" "}

        <span className="font-medium text-foreground">
          {filteredStudents}
        </span>
        
        {" "}of{" "}
        <span className="font-medium text-foreground">
          {totalStudents}
        </span>
        
        {" "}students
      </div>

    </div>
  </div>
  );
}