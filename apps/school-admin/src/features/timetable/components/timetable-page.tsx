"use client";

import { dummyTimetable } from "../data/mock-timetable";

import { TimetableHeader } from "./timetable-header";
import { TimetableGrid } from "./timetable-grid";

export function TimetablePage() {
  return (
    <div className="space-y-6 p-6">
      <TimetableHeader />

      <TimetableGrid
        entries={dummyTimetable.entries}
      />
    </div>
  );
}