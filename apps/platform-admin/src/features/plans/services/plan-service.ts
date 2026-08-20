import {
  createPlan,
  getPlans,
  deletePlan,
  updatePlan,
  updatePlanStatus,
} from "../api";

import {
  CreatePlanRequest,
  UpdatePlanRequest,
  UpdatePlanStatusRequest,
} from "../types";


export const planService = {
  list() {
    return getPlans();
  },

  create(payload: CreatePlanRequest) {
    return createPlan(payload);
  },

  delete(id: string) {
    return deletePlan(id);
  },
  
  update(
    id: string,
    payload: UpdatePlanRequest,
  ) {
    return updatePlan(
      id,
      payload,
    );
  },
  
  updateStatus(
    id: string,
    payload: UpdatePlanStatusRequest,
  ) {
    return updatePlanStatus(
      id,
      payload,
    );
  },
};