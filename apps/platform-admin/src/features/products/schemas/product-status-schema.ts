import { z } from "zod";

export const productStatusSchema = z.object({
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
  ]),
});

export type UpdateProductStatusValues =
  z.infer<typeof productStatusSchema>;