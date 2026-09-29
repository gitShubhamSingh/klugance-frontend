"use client";

import {
  CreditCard,
  Eye,
  MoreHorizontal,
  ReceiptText,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { FeeStudent } from "../types";

type Props = {
  students: FeeStudent[];
  onViewDetails: (student: FeeStudent) => void;
  onCollectPayment: (student: FeeStudent) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getName(student: FeeStudent) {
  return [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getStatusVariant(
  status: FeeStudent["status"],
) {
  switch (status) {
    case "paid":
      return "default";

    case "overdue":
      return "destructive";

    case "partial":
      return "secondary";

    default:
      return "outline";
  }
}

function getStatusLabel(
  status: FeeStudent["status"],
) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function FeesTable({
  students,
  onViewDetails,
  onCollectPayment,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">
              Student
            </TableHead>

            <TableHead className="px-4">
              Class
            </TableHead>

            <TableHead className="px-4 text-right">
              Total Fee
            </TableHead>

            <TableHead className="px-4 text-right">
              Paid
            </TableHead>

            <TableHead className="px-4 text-right">
              Outstanding
            </TableHead>

            <TableHead className="px-4">
              Due Date
            </TableHead>

            <TableHead className="px-4">
              Status
            </TableHead>

            <TableHead className="w-12 px-4" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="px-4 py-3">
                <div>
                  <p className="font-medium">
                    {getName(student)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {student.admission_number}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-4 py-3">
                {student.class_name} ·{" "}
                {student.section_name}
              </TableCell>

              <TableCell className="px-4 py-3 text-right tabular-nums">
                {formatCurrency(student.total_fee)}
              </TableCell>

              <TableCell className="px-4 py-3 text-right tabular-nums">
                {formatCurrency(student.paid_amount)}
              </TableCell>

              <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                {formatCurrency(
                  student.outstanding_amount,
                )}
              </TableCell>

              <TableCell className="px-4 py-3">
                {student.due_date}
              </TableCell>

              <TableCell className="px-4 py-3">
                <Badge
                  variant={getStatusVariant(
                    student.status,
                  )}
                  className="rounded-full"
                >
                  {getStatusLabel(student.status)}
                </Badge>
              </TableCell>

              <TableCell className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <MoreHorizontal className="size-4" />

                      <span className="sr-only">
                        Fee actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onViewDetails(student)
                      }
                    >
                      <Eye className="mr-2 size-4" />
                      View Fee Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        onCollectPayment(student)
                      }
                    >
                      <CreditCard className="mr-2 size-4" />
                      Collect Payment
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <ReceiptText className="mr-2 size-4" />
                      Payment History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}