import { getDashboard } from "../api";

export const dashboardService = {
  getOverview() {
    return getDashboard();
  },
};