export type PlanBillingCycle =
  | "MONTHLY"
  | "YEARLY";

export type PlanStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Plan {
  id: string;
  product_id: string;

  code: string;
  name: string;

  billing_cycle: PlanBillingCycle;

  /*
   * Backend serializes Decimal as string.
   * Keep it as string in API/domain type.
   */
  price: string;

  currency: string;

  status: PlanStatus;

  created_at: string;
  updated_at: string;
}