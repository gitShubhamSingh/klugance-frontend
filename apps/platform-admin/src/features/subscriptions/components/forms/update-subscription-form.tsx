"use client";

import {
  useEffect,
} from "react";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useForm,
} from "react-hook-form";

import {
  Button,
} from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Input,
} from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  updateSubscriptionSchema,
} from "../../schemas";

import type {
  UpdateSubscriptionFormValues,
} from "../../schemas";

import type {
  Subscription,
} from "../../types";

import {
  useUpdateSubscription,
} from "../../hooks";

/*
 * Change this import only if your Plan
 * list hook lives somewhere else.
 */
import {
  useProductPlans,
} from "@/features/plans/hooks";

interface UpdateSubscriptionFormProps {
  subscription: Subscription;

  onSuccess: () => void;
}

export function UpdateSubscriptionForm({
  subscription,
  onSuccess,
}: UpdateSubscriptionFormProps) {
  /*
   * Your existing plan architecture uses
   * product-specific plans, which is exactly
   * what we need here.
   */
  const {
    data: plans = [],
    isLoading: isLoadingPlans,
  } = useProductPlans(
    subscription.product.id,
  );

  const mutation =
    useUpdateSubscription();

  const form =
    useForm<UpdateSubscriptionFormValues>({
      resolver: zodResolver(
        updateSubscriptionSchema,
      ),

      defaultValues: {
        plan_id:
          subscription.plan_id,

        start_date:
          subscription.start_date,

        end_date:
          subscription.end_date,
      },
    });

  /*
   * Important when React Query supplies a
   * different/refetched subscription while
   * the component instance still exists.
   */
  useEffect(() => {
    form.reset({
      plan_id:
        subscription.plan_id,

      start_date:
        subscription.start_date,

      end_date:
        subscription.end_date,
    });
  }, [
    subscription,
    form,
  ]);

  async function onSubmit(
    values: UpdateSubscriptionFormValues,
  ) {
    await mutation.mutateAsync({
      id: subscription.id,
      payload: values,
    });

    onSuccess();
  }

  return (
    <Form {...form}>
      <form
        id="update-subscription-form"
        onSubmit={form.handleSubmit(
          onSubmit,
        )}
        className="space-y-5"
      >
        <div className="rounded-xl bg-muted/30 p-4">
          <div className="text-sm font-medium">
            {subscription.school.name}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {subscription.school.code}
          </div>

          <div className="mt-3 text-sm">
            {subscription.product.name}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {subscription.product.code}
          </div>
        </div>

        <FormField
          control={form.control}
          name="plan_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Plan
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
                disabled={
                  isLoadingPlans ||
                  mutation.isPending
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingPlans
                          ? "Loading plans..."
                          : "Select plan"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {plans.map(
                    (plan) => (
                      <SelectItem
                        key={plan.id}
                        value={plan.id}
                      >
                        {plan.name}
                        {" — "}
                        {plan.code}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Start Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={
                      mutation.isPending
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  End Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={
                      mutation.isPending
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mutation.isError && (
          <div className="rounded-lg bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">
              {mutation.error instanceof
              Error
                ? mutation.error.message
                : "Unable to update subscription."}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={
              mutation.isPending ||
              isLoadingPlans
            }
          >
            {mutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}