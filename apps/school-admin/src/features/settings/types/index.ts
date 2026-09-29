export type SubscriptionStatus =
  | "active"
  | "trial"
  | "expired"
  | "cancelled";

export type PaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded";

export type Invoice = {
  id: string;
  invoice_number: string;
  date: string;
  description: string;
  amount: number;
  status: PaymentStatus;
};

export type PaymentMethod = {
  id: string;
  type: "card" | "upi" | "bank";
  name: string;
  last_four: string | null;
  expiry: string | null;
  is_default: boolean;
};

export type Subscription = {
  plan_name: string;
  status: SubscriptionStatus;
  billing_cycle: "monthly" | "yearly";
  amount: number;
  next_billing_date: string;
  students_limit: number;
  students_used: number;
};