"use client";

import { useMemo, useState } from "react";

import { HomeworkHeader } from "./homework-header";
import { HomeworkOverview } from "./homework-overview";
import { HomeworkFilters } from "./homework-filters";
import { HomeworkTable } from "./homework-table";
import { HomeworkViewDialog } from "./homework-view-dialog";
import { HomeworkEditDialog } from "./homework-edit-dialog";

import { mockHomework } from "../data/mock-homework";

import type { Homework } from "../types";

export function HomeworkPage() {
  const [homework, setHomework] =
    useState<Homework[]>(mockHomework);

  const [search, setSearch] = useState("");

  const [classFilter, setClassFilter] =
    useState("all");

  const [subjectFilter, setSubjectFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedHomework, setSelectedHomework] =
    useState<Homework | null>(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const filteredHomework = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return homework.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        item.subject
          .toLowerCase()
          .includes(normalizedSearch) ||
        item.teacher_name
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesClass =
        classFilter === "all" ||
        item.class_name === classFilter;

      const matchesSubject =
        subjectFilter === "all" ||
        item.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesSubject &&
        matchesStatus
      );
    });
  }, [
    homework,
    search,
    classFilter,
    subjectFilter,
    statusFilter,
  ]);

  function handleView(item: Homework) {
    setSelectedHomework(item);
    setViewOpen(true);
  }

  function handleEdit(item: Homework) {
    setSelectedHomework(item);
    setEditOpen(true);
  }

  function handleSave(updated: Homework) {
    setHomework((current) =>
      current.map((item) =>
        item.id === updated.id
          ? updated
          : item,
      ),
    );
  }

  function clearFilters() {
    setSearch("");
    setClassFilter("all");
    setSubjectFilter("all");
    setStatusFilter("all");
  }

  function handleRefresh() {
    setIsRefreshing(true);

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <HomeworkHeader
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Overview */}
      <HomeworkOverview homework={homework} />

      {/* Filters */}
      <HomeworkFilters
        search={search}
        onSearchChange={setSearch}
        classFilter={classFilter}
        onClassChange={setClassFilter}
        subjectFilter={subjectFilter}
        onSubjectChange={setSubjectFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClear={clearFilters}
      />

      {/* Result summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Homework Assignments
          </h2>

          <p className="text-sm text-muted-foreground">
            {filteredHomework.length}{" "}
            {filteredHomework.length === 1
              ? "assignment"
              : "assignments"}{" "}
            found
          </p>
        </div>
      </div>

      {/* Homework */}
      <HomeworkTable
        homework={filteredHomework}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* View */}
      <HomeworkViewDialog
        homework={selectedHomework}
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);

          if (!open) {
            setSelectedHomework(null);
          }
        }}
      />

      {/* Edit */}
      <HomeworkEditDialog
        homework={selectedHomework}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedHomework(null);
          }
        }}
        onSave={handleSave}
      />
    </div>
  );
}