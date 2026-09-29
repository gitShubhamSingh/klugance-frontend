"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  classFilter: string;
  onClassChange: (value: string) => void;

  subjectFilter: string;
  onSubjectChange: (value: string) => void;

  statusFilter: string;
  onStatusChange: (value: string) => void;

  onClear: () => void;
};

export function HomeworkFilters({
  search,
  onSearchChange,
  classFilter,
  onClassChange,
  subjectFilter,
  onSubjectChange,
  statusFilter,
  onStatusChange,
  onClear,
}: Props) {
  const hasFilters =
    search ||
    classFilter !== "all" ||
    subjectFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search homework, subject, or teacher..."
            className="h-11 pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <FilterSelect
            label="Class"
            value={classFilter}
            onChange={onClassChange}
            options={[
              ["all", "All Classes"],
              ["Class 6", "Class 6"],
              ["Class 7", "Class 7"],
              ["Class 8", "Class 8"],
              ["Class 9", "Class 9"],
            ]}
          />

          <FilterSelect
            label="Subject"
            value={subjectFilter}
            onChange={onSubjectChange}
            options={[
              ["all", "All Subjects"],
              ["Mathematics", "Mathematics"],
              ["Science", "Science"],
              ["English", "English"],
              ["Social Science", "Social Science"],
            ]}
          />

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              ["all", "All Status"],
              ["active", "Active"],
              ["due_soon", "Due Soon"],
              ["overdue", "Overdue"],
              ["completed", "Completed"],
            ]}
          />

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              onClick={onClear}
            >
              <X className="size-4" />
              Clear filters
            </Button>
          )}

          {!hasFilters && (
            <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
              <SlidersHorizontal className="size-4" />
              Filter assignments
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex min-w-40 flex-1 flex-col gap-1.5 sm:max-w-52">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}