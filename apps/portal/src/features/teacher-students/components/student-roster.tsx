"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InitialsAvatar } from "@/features/dashboard/components/shared/initials-avatar";
import { SectionCard } from "@/features/dashboard/components/shared/section-card";
import { cn } from "@/lib/utils";

import {
  attendanceBar,
  compareRoll,
  flagLabels,
  formatPercent,
  flagStyles,
  getStudentFlag,
  scoreTone,
  type StudentFlag,
} from "../lib/student-insights";
import type { ClassSection, TeacherStudent } from "../types/teacher-students";

type Props = {
  students: TeacherStudent[];
  sections: ClassSection[];
  sectionLabel: string;
  showClassColumn: boolean;
  onSelectStudent: (student: TeacherStudent) => void;
};

type QuickFilter = "all" | StudentFlag | "absent";
type SortKey = "rollNo" | "name" | "attendance" | "avgScore";

const PAGE_SIZE = 10;

/** Nulls (no data yet) always sort last. */
function compareMetric(a: number | null, b: number | null, dir: number) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * dir;
}

export function StudentRoster({
  students,
  sections,
  sectionLabel,
  showClassColumn,
  onSelectStudent,
}: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<QuickFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "rollNo",
    dir: "asc",
  });
  const [page, setPage] = useState(0);

  const sectionNames = useMemo(
    () => new Map(sections.map((s) => [s.id, s.shortName])),
    [sections],
  );
  const sectionOrder = useMemo(
    () => new Map(sections.map((s, i) => [s.id, i])),
    [sections],
  );

  const counts = useMemo(() => {
    const c = { all: students.length, top: 0, attention: 0, steady: 0, absent: 0 };
    students.forEach((s) => {
      c[getStudentFlag(s)] += 1;
      if (s.presentToday === false) c.absent += 1;
    });
    return c;
  }, [students]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = students.filter((s) => {
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.rollNo.toLowerCase().includes(q) &&
        !s.admissionNumber.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filter === "absent") return s.presentToday === false;
      if (filter !== "all") return getStudentFlag(s) === filter;
      return true;
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.key === "name") return a.name.localeCompare(b.name) * dir;
      if (sort.key === "rollNo") {
        if (showClassColumn) {
          const bySection =
            (sectionOrder.get(a.sectionId) ?? 0) - (sectionOrder.get(b.sectionId) ?? 0);
          if (bySection !== 0) return bySection * dir;
        }
        return compareRoll(a.rollNo, b.rollNo) * dir;
      }
      return compareMetric(a[sort.key], b[sort.key], dir);
    });
  }, [students, query, filter, sort, showClassColumn, sectionOrder]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setPage(0);
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "rollNo" ? "asc" : "desc" },
    );
  }

  const filters: Array<{ value: QuickFilter; label: string; count: number }> = [
    { value: "all", label: "All", count: counts.all },
    { value: "top", label: "Top performers", count: counts.top },
    { value: "attention", label: "Needs attention", count: counts.attention },
    { value: "absent", label: "Absent today", count: counts.absent },
  ];

  return (
    <SectionCard
      className="xl:col-span-2"
      title="Student list"
      description={`${sectionLabel} · ${students.length} students`}
      icon={UsersRound}
      contentClassName="p-0"
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search name, roll or admission no."
            className="h-9 pl-8"
            aria-label="Search students"
          />
        </div>

        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setFilter(f.value);
                setPage(0);
              }}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.value
                  ? "border-foreground bg-foreground text-background"
                  : "hover:bg-muted",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-3xs tabular-nums",
                  filter === f.value ? "bg-background/20" : "bg-muted",
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-10 w-14 bg-muted/30 pl-5">
              <SortButton label="Roll" active={sort.key === "rollNo"} dir={sort.dir} onClick={() => toggleSort("rollNo")} />
            </TableHead>
            <TableHead className="h-10 bg-muted/30">
              <SortButton label="Student" active={sort.key === "name"} dir={sort.dir} onClick={() => toggleSort("name")} />
            </TableHead>
            <TableHead className="hidden h-10 bg-muted/30 md:table-cell">
              <SortButton label="Attendance" active={sort.key === "attendance"} dir={sort.dir} onClick={() => toggleSort("attendance")} />
            </TableHead>
            <TableHead className="h-10 bg-muted/30">
              <SortButton label="Avg. score" active={sort.key === "avgScore"} dir={sort.dir} onClick={() => toggleSort("avgScore")} />
            </TableHead>
            <TableHead className="hidden h-10 bg-muted/30 lg:table-cell">Homework</TableHead>
            <TableHead className="hidden h-10 bg-muted/30 pr-5 sm:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.map((s) => {
            const flag = getStudentFlag(s);
            return (
              <TableRow
                key={s.id}
                onClick={() => onSelectStudent(s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectStudent(s);
                  }
                }}
                tabIndex={0}
                className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
              >
                <TableCell className="pl-5 text-muted-foreground tabular-nums">
                  {s.rollNo}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <InitialsAvatar name={s.name} size="sm" />
                      {s.presentToday === false && (
                        <span
                          title="Absent today"
                          className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-rose-500 ring-2 ring-card"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {showClassColumn
                          ? `Class ${sectionNames.get(s.sectionId) ?? ""}`
                          : (s.parentName ?? `Adm. ${s.admissionNumber}`)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex w-32 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full", attendanceBar(s.attendance))}
                        style={{ width: `${s.attendance ?? 0}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs tabular-nums">{formatPercent(s.attendance)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold tabular-nums", scoreTone(s.avgScore))}>
                      {formatPercent(s.avgScore)}
                    </span>
                    <Trend value={s.trend} />
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm tabular-nums lg:table-cell">
                  {formatPercent(s.homeworkRate)}
                </TableCell>
                <TableCell className="hidden pr-5 sm:table-cell">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-2xs font-medium whitespace-nowrap", flagStyles[flag])}>
                    {flagLabels[flag]}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}

          {pageRows.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-14 text-center text-sm text-muted-foreground">
                No students match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {rows.length === 0
            ? "0 students"
            : `Showing ${safePage * PAGE_SIZE + 1}–${Math.min(rows.length, (safePage + 1) * PAGE_SIZE)} of ${rows.length}`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="px-2 tabular-nums">
            {safePage + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage(safePage + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <Icon className="size-3.5" />
    </button>
  );
}

function Trend({ value }: { value: number | null }) {
  if (value === null || value === 0) return <span className="text-2xs text-muted-foreground">—</span>;
  const up = value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center text-2xs font-medium tabular-nums",
        up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      )}
    >
      {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(value)}
    </span>
  );
}
