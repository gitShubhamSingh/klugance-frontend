import {
    PlanBillingCycle,
  } from "./plan";
  
  export interface CreatePlanRequest {
    product_id: string;
  
    code: string;
    name: string;
  
    billing_cycle: PlanBillingCycle;
  
    price: number;
  
    currency: string;
  }