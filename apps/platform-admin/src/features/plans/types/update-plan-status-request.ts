import { Plan } from "./plan";

export interface UpdatePlanStatusRequest {
  status: Plan["status"];
}