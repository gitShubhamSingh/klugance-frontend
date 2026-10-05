"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useCreatePeriod } from "../hooks/use-create-period";

const createPeriodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Period name is required"),

    start_time: z
      .string()
      .min(1, "Start time is required"),

    end_time: z
      .string()
      .min(1, "End time is required"),
  })
  .refine(
    (values) => values.end_time > values.start_time,
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

type FormValues = z.infer<typeof createPeriodSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  sectionId: string;
};

export function CreatePeriodDialog({
  open,
  onOpenChange,
  classId,
  sectionId
}: Props) {
  const createPeriodMutation = useCreatePeriod();

  const form = useForm<FormValues>({
    resolver: zodResolver(createPeriodSchema),
    defaultValues: {
      name: "",
      start_time: "",
      end_time: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: FormValues) {
    try {
      await createPeriodMutation.mutateAsync({
        name: values.name.trim(),
        start_time: values.start_time,
        end_time: values.end_time,
        class_id: classId,
        section_id: sectionId,
      });

      toast.success("Period created successfully.");

      form.reset();

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to create period:",
        error,
      );

      toast.error(
        "Failed to create period. Please try again.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (createPeriodMutation.isPending) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Period</DialogTitle>

          <DialogDescription>
            Create a period by defining its name and
            duration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Period 1"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Time
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      End Time
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={
                  createPeriodMutation.isPending
                }
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  createPeriodMutation.isPending
                }
              >
                {createPeriodMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Period"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}