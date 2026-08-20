export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "PENDING"
  | "ON_HOLD"
  | "PAUSED"
  | "SUSPENDED"
  | "EXPIRED"
  | "CANCELLED"
  | "ARCHIVED";

export type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

export interface SubscriptionSchool {
  id: string;
  name: string;
  code: string;
}

export interface SubscriptionProduct {
  id: string;
  code: string;
  name: string;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  billing_cycle: BillingCycle;
  price: string;
  currency: string;
}



export interface Subscription {
  id: string;

  school_id: string;
  plan_id: string;

  school: {
    id: string;
    name: string;
    code: string;
  };

  product: {
    id: string;
    code: string;
    name: string;
  };

  plan: {
    id: string;
    code: string;
    name: string;
    billing_cycle:
      | "MONTHLY"
      | "YEARLY";
    price: string;
    currency: string;
  };

  start_date: string;
  end_date: string;

  status: SubscriptionStatus;

  is_deleted: boolean;
  deleted_at: string | null;

  created_at: string;
  updated_at: string;
}