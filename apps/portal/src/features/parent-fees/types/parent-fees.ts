import type { ParentFeeSummary } from "@/features/dashboard/types/parent-dashboard";

/* Mirrors backend_v2 `ParentChildFeesResponse`. */

export type ParentFeeComponent = {
  name: string;
  amount: number;
  is_optional: boolean;
};

export type ParentFeePayment = {
  id: string;
  amount_paid: number;
  payment_reference: string | null;
  paid_at: string;
};

export type ParentFeeInvoice = {
  id: string;
  invoice_number: string;
  structure_name: string;
  issued_at: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  components: ParentFeeComponent[];
  payments: ParentFeePayment[];
};

export type ParentChildFees = {
  student_profile_id: string;
  summary: ParentFeeSummary;
  invoices: ParentFeeInvoice[];
};
