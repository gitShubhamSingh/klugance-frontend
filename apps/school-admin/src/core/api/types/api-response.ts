export interface ApiError {
  code: string;
  message: string;
  field?: string | null;
}

export interface ApiMeta {
  page?: number;
  page_size?: number;
  total_records?: number;
  total_pages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;

  data: T;

  errors: ApiError[];

  meta: ApiMeta | null;

  timestamp: string;

  trace_id: string | null;

  encrypted: boolean;

  algorithm: string | null;

  version: string;
}