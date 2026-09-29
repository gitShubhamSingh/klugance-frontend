"use client";

import { useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MOCK_EXAMS } from "../data/mock-exams";

import type {
  Exam,
  ExamStatus,
} from "../types";

import { ExamsHeader } from "./exams-header";
import { ExamCard } from "./exam-card";

export function ExamsPage() {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<"all" | ExamStatus>("all");

  const filteredExams = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return MOCK_EXAMS.filter(
      (exam) => {
        const matchesSearch =
          !query ||
          exam.name
            .toLowerCase()
            .includes(query) ||
          exam.academic_year
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "all" ||
          exam.status === status;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    );
  }, [search, status]);

  function handleView(exam: Exam) {
    console.log(
      "View examination:",
      exam.id,
    );
  }

  function handleEdit(exam: Exam) {
    console.log(
      "Edit examination:",
      exam.id,
    );
  }

  function handleCreate() {
    console.log(
      "Create examination",
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ExamsHeader
        totalExams={MOCK_EXAMS.length}
        onCreateExam={handleCreate}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search exams..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />

            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(
                  value as
                    | "all"
                    | ExamStatus,
                )
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All statuses
                </SelectItem>

                <SelectItem value="draft">
                  Draft
                </SelectItem>

                <SelectItem value="scheduled">
                  Scheduled
                </SelectItem>

                <SelectItem value="ongoing">
                  Ongoing
                </SelectItem>

                <SelectItem value="completed">
                  Completed
                </SelectItem>

                <SelectItem value="results_ready">
                  Results Ready
                </SelectItem>

                <SelectItem value="published">
                  Published
                </SelectItem>

                <SelectItem value="cancelled">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredExams.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {MOCK_EXAMS.length}
            </span>{" "}
            exams
          </p>
        </div>

        {filteredExams.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              No exams found
            </h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map(
              (exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onView={handleView}
                  onEdit={handleEdit}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}