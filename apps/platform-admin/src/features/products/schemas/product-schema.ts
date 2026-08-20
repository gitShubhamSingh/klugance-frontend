import { z } from "zod";

export const createProductSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Product code is required")
    .max(50, "Product code is too long"),

  name: z
    .string()
    .trim()
    .min(3, "Product name is required")
    .max(150, "Product name is too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name is required")
    .max(150, "Product name is too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type CreateProductFormValues =
  z.infer<typeof createProductSchema>;

export type UpdateProductFormValues =
  z.infer<typeof updateProductSchema>;