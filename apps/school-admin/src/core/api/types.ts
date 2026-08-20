import type {
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  
  export interface RetryAxiosRequestConfig
    extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }
  
  export interface RefreshQueueItem {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
  }