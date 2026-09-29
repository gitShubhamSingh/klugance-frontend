"use client";

import { useState } from "react";

import { FeesHeader } from "./fees-header";
import { FeesContext } from "./fees-context";
import { FeesSummary } from "./fees-summary";
import { FeesCollectionChart } from "./fees-collection-chart";
import { FeesTable } from "./fees-table";
import { FeeDetailsDialog } from "./fee-details-dialog";
import { CollectPaymentDialog } from "./collect-payment-dialog";

import type {
  CollectionPoint,
  FeeStudent,
  FeeSummary,
} from "../types";

const summary: FeeSummary = {
  total_fee: 4850000,
  collected: 3620000,
  outstanding: 1230000,
  overdue: 480000,
  collection_percentage: 74.6,
  overdue_students: 39,
};

const collectionData: CollectionPoint[] = [
  { date: "01", amount: 82000 },
  { date: "03", amount: 116000 },
  { date: "05", amount: 94000 },
  { date: "07", amount: 152000 },
  { date: "09", amount: 128000 },
  { date: "11", amount: 184000 },
  { date: "13", amount: 142000 },
  { date: "15", amount: 210000 },
  { date: "17", amount: 178000 },
  { date: "19", amount: 224000 },
  { date: "21", amount: 198000 },
  { date: "23", amount: 246000 },
];

const students: FeeStudent[] = [
  {
    id: "student-1",
    first_name: "Aarav",
    middle_name: null,
    last_name: "Sharma",
    admission_number: "ADM-2026-001",
    class_name: "Class 8",
    section_name: "A",
    total_fee: 42000,
    paid_amount: 42000,
    outstanding_amount: 0,
    due_date: "10 Aug 2026",
    status: "paid",
    fee_breakdown: [
      { name: "Tuition Fee", amount: 30000 },
      { name: "Transport", amount: 6000 },
      { name: "Examination", amount: 2000 },
      { name: "Activity", amount: 4000 },
    ],
    installments: [
      {
        id: "i1",
        due_date: "10 Apr 2026",
        amount: 14000,
        status: "paid",
      },
      {
        id: "i2",
        due_date: "10 Jul 2026",
        amount: 14000,
        status: "paid",
      },
      {
        id: "i3",
        due_date: "10 Oct 2026",
        amount: 14000,
        status: "paid",
      },
    ],
  },

  {
    id: "student-2",
    first_name: "Riya",
    middle_name: null,
    last_name: "Patel",
    admission_number: "ADM-2026-002",
    class_name: "Class 8",
    section_name: "A",
    total_fee: 42000,
    paid_amount: 30000,
    outstanding_amount: 12000,
    due_date: "10 Aug 2026",
    status: "partial",
    fee_breakdown: [
      { name: "Tuition Fee", amount: 30000 },
      { name: "Transport", amount: 6000 },
      { name: "Examination", amount: 2000 },
      { name: "Activity", amount: 4000 },
    ],
    installments: [
      {
        id: "i1",
        due_date: "10 Apr 2026",
        amount: 14000,
        status: "paid",
      },
      {
        id: "i2",
        due_date: "10 Jul 2026",
        amount: 14000,
        status: "paid",
      },
      {
        id: "i3",
        due_date: "10 Oct 2026",
        amount: 14000,
        status: "pending",
      },
    ],
  },

  {
    id: "student-3",
    first_name: "Kabir",
    middle_name: null,
    last_name: "Singh",
    admission_number: "ADM-2026-003",
    class_name: "Class 8",
    section_name: "B",
    total_fee: 42000,
    paid_amount: 20000,
    outstanding_amount: 22000,
    due_date: "05 Aug 2026",
    status: "overdue",
    fee_breakdown: [
      { name: "Tuition Fee", amount: 30000 },
      { name: "Transport", amount: 6000 },
      { name: "Examination", amount: 2000 },
      { name: "Activity", amount: 4000 },
    ],
    installments: [
      {
        id: "i1",
        due_date: "10 Apr 2026",
        amount: 14000,
        status: "paid",
      },
      {
        id: "i2",
        due_date: "10 Jul 2026",
        amount: 14000,
        status: "partial",
      },
      {
        id: "i3",
        due_date: "10 Oct 2026",
        amount: 14000,
        status: "pending",
      },
    ],
  },

  {
    id: "student-4",
    first_name: "Anaya",
    middle_name: null,
    last_name: "Mehta",
    admission_number: "ADM-2026-004",
    class_name: "Class 7",
    section_name: "A",
    total_fee: 38000,
    paid_amount: 0,
    outstanding_amount: 38000,
    due_date: "15 Sep 2026",
    status: "pending",
    fee_breakdown: [
      { name: "Tuition Fee", amount: 28000 },
      { name: "Transport", amount: 6000 },
      { name: "Examination", amount: 2000 },
      { name: "Activity", amount: 2000 },
    ],
    installments: [
      {
        id: "i1",
        due_date: "15 Sep 2026",
        amount: 19000,
        status: "pending",
      },
      {
        id: "i2",
        due_date: "15 Dec 2026",
        amount: 19000,
        status: "pending",
      },
    ],
  },
];

export function FeesPage() {
  const [selectedStudent, setSelectedStudent] =
    useState<FeeStudent | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [paymentStudent, setPaymentStudent] =
    useState<FeeStudent | null>(null);

  const [paymentOpen, setPaymentOpen] =
    useState(false);

  function handleViewDetails(
    student: FeeStudent,
  ) {
    setSelectedStudent(student);
    setDetailsOpen(true);
  }

  function handleCollectPayment(
    student?: FeeStudent,
  ) {
    if (student) {
      setPaymentStudent(student);
    } else {
      setPaymentStudent(students[0] ?? null);
    }

    setPaymentOpen(true);
  }

  return (
    <div className="space-y-6 p-6">
      <FeesHeader
        onCollectPayment={() =>
          handleCollectPayment()
        }
      />

      <FeesContext />

      <FeesSummary summary={summary} />

      <FeesCollectionChart
        data={collectionData}
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Fee Status
            </h2>

            <p className="text-sm text-muted-foreground">
              Monitor student payments and outstanding
              balances.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {students.length} students
          </p>
        </div>

        <FeesTable
          students={students}
          onViewDetails={handleViewDetails}
          onCollectPayment={
            handleCollectPayment
          }
        />
      </div>

      <FeeDetailsDialog
        student={selectedStudent}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);

          if (!open) {
            setSelectedStudent(null);
          }
        }}
      />

      <CollectPaymentDialog
        student={paymentStudent}
        open={paymentOpen}
        onOpenChange={(open) => {
          setPaymentOpen(open);

          if (!open) {
            setPaymentStudent(null);
          }
        }}
      />
    </div>
  );
}