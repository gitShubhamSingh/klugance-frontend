"use client";

import { UseFormReturn } from "react-hook-form";
import { Info } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CreateSchoolFormValues } from "../../schemas/create-school.schema";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  form: UseFormReturn<CreateSchoolFormValues>;
}

export function SchoolStep({
  form,
}: Props) {
  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="school.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="ABC Public School"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        
            
       
<FormField
  control={form.control}
  name="school.code"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-center gap-1.5">
        <FormLabel>
          <b>UDISE+</b> Code
        </FormLabel>

        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger
              type="button"
              aria-label="UDISE+ code information"
              className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Info className="size-4" />
            </TooltipTrigger>

            <TooltipContent
              side="top"
              className="max-w-xs bg-foreground text-background"
            >
              UDISE+ is the Unified District Information System for Education Plus.
              Enter the official code assigned to your school.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <FormControl>
        <Input
          placeholder="Enter UDISE+ School Code"
          {...field}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="academic_year.name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Academic Year Name</FormLabel>
      <FormControl>
        <Input placeholder="2026-2027" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="academic_year.start_date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Start Date</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="academic_year.end_date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>End Date</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="academic_year.is_current"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center gap-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel>Set as current academic year</FormLabel>
    </FormItem>
  )}
/>

        <FormField
          control={form.control}
          name="school.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  placeholder="info@school.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school.mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>

              <FormControl>
                <Input
                  placeholder="9876543210"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>

              <FormControl>
                <Input
                  placeholder="https://school.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div />

        <FormField
          control={form.control}
          name="school.address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address</FormLabel>

              <FormControl>
                <Textarea
                  rows={3}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school.description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Description</FormLabel>

              <FormControl>
                <Textarea
                  rows={4}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}