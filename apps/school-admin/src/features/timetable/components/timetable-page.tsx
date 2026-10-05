"use client";

import { useState } from "react";

import { useTimetableGrid } from "../hooks/use-timetable-grid";
import { TimetableHeader } from "./timetable-header";
import { TimetableGrid } from "./timetable-grid";

export function TimetablePage() {
  const [selectedAcademicYearId, setSelectedAcademicYearId] =
    useState("");

  const [selectedClassId, setSelectedClassId] =
    useState("");

  const [selectedSectionId, setSelectedSectionId] =
    useState("");

  const timetableQuery = useTimetableGrid(
    selectedClassId,
    selectedSectionId,
  );

  return (
    <div className="space-y-6 p-6">
      <TimetableHeader
        selectedClassId={selectedClassId}
        selectedSectionId={selectedSectionId}
        onAcademicYearChange={setSelectedAcademicYearId}
        onClassChange={(classId) => {
          setSelectedClassId(classId);
          setSelectedSectionId("");
        }}
        onSectionChange={setSelectedSectionId}
      />

      <TimetableGrid
        data={timetableQuery.data}
        isLoading={timetableQuery.isLoading}
        classId={selectedClassId}
        sectionId={selectedSectionId}
        academicYearId={selectedAcademicYearId}
      />
    </div>
  );
}