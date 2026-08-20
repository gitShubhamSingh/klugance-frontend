import {
    createSubscription,
    getSubscription,
    getSubscriptions,
    updateSubscription,
    deleteSubscription,
    updateSubscriptionStatus
} from "../api";
  
import type {
    CreateSubscriptionFormValues,
    UpdateSubscriptionFormValues,
} from "../schemas";
import type {
    SubscriptionStatus,
  } from "../types";

  
export const subscriptionService = {

    list() {
      return getSubscriptions();
    },
    get(id: string) {
        return getSubscription(id);
    },
    create(
      payload: CreateSubscriptionFormValues,
    ) {
      return createSubscription(payload);
    },
    update(
        id: string,
        payload: UpdateSubscriptionFormValues,
      ) {
        return updateSubscription(
          id,
          payload,
        );
    },
    delete(id: string) {
        return deleteSubscription(id);
      },
    updateStatus(
        id: string,
        status: SubscriptionStatus,
      ) {
        return updateSubscriptionStatus(
          id,
          status,
        );
      },
};