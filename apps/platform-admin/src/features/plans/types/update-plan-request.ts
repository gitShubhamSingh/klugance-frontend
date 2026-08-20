import { Plan } from "./plan";

export interface UpdatePlanRequest {
  name: string;

  billing_cycle:
    Plan["billing_cycle"];

  price: number;

  currency: string;
}