"use client";

import {
  CalendarDays,
  ChevronDown,
  Copy,
  History,
  Loader2,
  School,
  Settings2,
  Clock3,
  Plus
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAcademicYears } from "@/features/academic-years/hooks/use-academic-years";
import { useClasses } from "@/features/classes/hooks/use-classes";
import { useSections } from "@/features/sections/hooks/use-sections";

type Props = {
  selectedClassId?: string;
  selectedSectionId?: string;
  onClassChange?: (classId: string) => void;
  onSectionChange?: (sectionId: string) => void;
};

export function TimetableHeader({
  selectedClassId: controlledClassId,
  selectedSectionId: controlledSectionId,
  onClassChange,
  onSectionChange,
}: Props) {

  const academicYearQuery = useAcademicYears();

  const academicYear = academicYearQuery.data;

  const academicYearId = academicYear?.id ?? "";

  const classesQuery = useClasses(
    academicYearId,
  );

  const classes = classesQuery.data ?? [];

  const [internalClassId, setInternalClassId] =
    useState("");

  const selectedClassId =
    controlledClassId ??
    internalClassId;

  useEffect(() => {
    if (!classes.length) {
      if (!controlledClassId) {
        setInternalClassId("");
      }

      return;
    }

    const selectedClassExists =
      classes.some(
        (schoolClass) =>
          schoolClass.id === selectedClassId,
      );

    if (!selectedClassExists) {
      const firstClassId =
        classes[0].id;

      if (!controlledClassId) {
        setInternalClassId(firstClassId);
      }

      onClassChange?.(firstClassId);
    }
  }, [
    classes,
    selectedClassId,
    controlledClassId,
    onClassChange,
  ]);


  const sectionsQuery = useSections(
    selectedClassId || undefined,
  );

  const sections = sectionsQuery.data ?? [];


  const [internalSectionId, setInternalSectionId] =
    useState("");

  const selectedSectionId =
    controlledSectionId ??
    internalSectionId;


  useEffect(() => {
    if (!sections.length) {
      if (!controlledSectionId) {
        setInternalSectionId("");
      }

      onSectionChange?.("");

      return;
    }

    const selectedSectionExists =
      sections.some(
        (section) =>
          section.id === selectedSectionId,
      );

    if (!selectedSectionExists) {
      const firstSectionId =
        sections[0].id;

      if (!controlledSectionId) {
        setInternalSectionId(
          firstSectionId,
        );
      }

      onSectionChange?.(
        firstSectionId,
      );
    }
  }, [
    sections,
    selectedSectionId,
    controlledSectionId,
    onSectionChange,
  ]);

  const selectedClass =
    classes.find(
      (schoolClass) =>
        schoolClass.id === selectedClassId,
    );

  const selectedSection =
    sections.find(
      (section) =>
        section.id === selectedSectionId,
    );


  function handleClassChange(
    classId: string,
  ) {

    if (!controlledClassId) {
      setInternalClassId(classId);
    }

    if (!controlledSectionId) {
      setInternalSectionId("");
    }

    onClassChange?.(classId);

    onSectionChange?.("");
  }

  function handleSectionChange(
    sectionId: string,
  ) {
    if (!controlledSectionId) {
      setInternalSectionId(
        sectionId,
      );
    }

    onSectionChange?.(
      sectionId,
    );
  }


  return (
    <div className="space-y-5">
      
      {/* Page heading */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <CalendarDays className="size-5 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Timetable
              </h1>

              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage class schedules, periods, teachers and rooms.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
          >
            <History className="mr-2 size-4" />
            History
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
          >
            <Copy className="mr-2 size-4" />
            Copy Timetable
          </Button>

          <Button
            type="button"
            size="sm"
          >
            <Settings2 className="mr-2 size-4" />
            Edit Timetable
          </Button>
        </div>
      </div>

      {/* Context */}
      <div className="rounded-2xl border bg-card p-2 shadow-sm">
        <div className="grid gap-2 md:grid-cols-4">
          {/* Academic Year */}
          <ContextItem
            icon={
              <School className="size-4" />
            }
            label="Academic Year"
            value={
              academicYearQuery.isLoading
                ? "Loading..."
                : academicYear?.name ??
                  "No academic year"
            }
            loading={
              academicYearQuery.isLoading
            }
          />

          {/* Class */}
          <Select
            value={selectedClassId}
            onValueChange={
              handleClassChange
            }
            disabled={
              classesQuery.isLoading ||
              classes.length === 0
            }
          >
            <SelectTrigger
              className="h-auto min-h-16 w-full border-0 bg-transparent px-4 py-3 shadow-none hover:bg-muted/60 focus:ring-0"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <School className="size-4" />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Class
                  </p>

                  <SelectValue
                    placeholder={
                      classesQuery.isLoading
                        ? "Loading..."
                        : "Select class"
                    }
                  >
                    {selectedClass?.name}
                  </SelectValue>
                </div>
              </div>

              {classesQuery.isLoading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                null
              )}
            </SelectTrigger>

            <SelectContent>
              {classes.map(
                (schoolClass) => (
                  <SelectItem
                    key={schoolClass.id}
                    value={schoolClass.id}
                  >
                    {schoolClass.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {/* Section */}
          <Select
            value={selectedSectionId}
            onValueChange={
              handleSectionChange
            }
            disabled={
              !selectedClassId ||
              sectionsQuery.isLoading ||
              sections.length === 0
            }
          >
            <SelectTrigger
              className="h-auto min-h-16 w-full border-0 bg-transparent px-4 py-3 shadow-none hover:bg-muted/60 focus:ring-0"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <School className="size-4" />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Section
                  </p>

                  <SelectValue
                    placeholder={
                      !selectedClassId
                        ? "Select class first"
                        : sectionsQuery.isLoading
                          ? "Loading..."
                          : "Select section"
                    }
                  >
                    {selectedSection?.name}
                  </SelectValue>
                </div>
              </div>

              {sectionsQuery.isLoading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                null
              )}
            </SelectTrigger>

            <SelectContent>
              {sections.map(
                (section) => (
                  <SelectItem
                    key={section.id}
                    value={section.id}
                  >
                    {section.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>

          </Select>


          
        {/* Button */}
        <div className="flex min-h-16 items-center justify-end rounded-xl px-4 py-3">
          <Button
            type="button"
            size="sm"
            // onClick={handleCreatePeriod}
          >
            <Plus className="mr-2 size-4" />
            Create Period
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}


function ContextItem({
  icon,
  label,
  value,
  loading = false,
  button,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  loading?: boolean;
  button?: ReactNode;
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-muted/60">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {value}
        </p>
      </div>

      {loading && (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
      )}

      {button}
    </div>
  );
}