export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Product {
  id: string;

  code: string;
  name: string;
  description: string | null;

  status: ProductStatus;

  created_at: string;
  updated_at: string;
}