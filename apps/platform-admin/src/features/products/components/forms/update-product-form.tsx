"use client";

import { UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  UpdateProductFormValues,
} from "../../schemas";

interface Props {
  form: UseFormReturn<UpdateProductFormValues>;
  productCode: string;
}

export function UpdateProductForm({
  form,
  productCode,
}: Props) {
  return (
    <Form {...form}>
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">

          {/* Product Code — display only, not part of form */}
          <div className="space-y-2">
            <Label htmlFor="product-code">
              Product Code
            </Label>

            <Input
              id="product-code"
              value={productCode}
              disabled
              readOnly
            />

            <p className="text-xs text-muted-foreground">
              Product code cannot be changed.
            </p>
          </div>

          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Klugance School Operating System"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe the product and its purpose..."
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