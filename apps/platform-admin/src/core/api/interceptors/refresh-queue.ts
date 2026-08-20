import type { AxiosError } from "axios";
import type { RefreshQueueItem } from "../types";

let refreshing = false;
let queue: RefreshQueueItem[] = [];

export function isRefreshing() {
  return refreshing;
}

export function startRefreshing() {
  refreshing = true;
}

export function stopRefreshing() {
  refreshing = false;
}

export function enqueue(item: RefreshQueueItem) {
  queue.push(item);
}

export function resolveQueue(token: string) {
  queue.forEach((item) => item.resolve(token));
  queue = [];
}

export function rejectQueue(error: AxiosError) {
  queue.forEach((item) => item.reject(error));
  queue = [];
}