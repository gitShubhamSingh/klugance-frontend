export type FeeStatus =
  | "paid"
  | "partial"
  | "pending"
  | "overdue"
  | "waived";

export type PaymentMethod =
  | "Cash"
  | "UPI"
  | "Bank Transfer"
  | "Card"
  | "Cheque";

export type FeeStudent = {
  id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  admission_number: string;

  class_name: string;
  section_name: string;

  total_fee: number;
  paid_amount: number;
  outstanding_amount: number;

  due_date: string;

  status: FeeStatus;

  fee_breakdown: {
    name: string;
    amount: number;
  }[];

  installments: {
    id: string;
    due_date: string;
    amount: number;
    status: FeeStatus;
  }[];
};

export type FeeSummary = {
  total_fee: number;
  collected: number;
  outstanding: number;
  overdue: number;

  collection_percentage: number;
  overdue_students: number;
};

export type CollectionPoint = {
  date: string;
  amount: number;
};