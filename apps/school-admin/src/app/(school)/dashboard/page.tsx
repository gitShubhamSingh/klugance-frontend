"use client";

import {useAuthStore,} from "@/core/auth";

import {PageContainer,} from "../_components/page_container";

import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export default function DashboardPage() {
  
    const user =
    useAuthStore(
      (state) => state.user,
    );

  return (
    <PageContainer>
      <DashboardOverview />
    </PageContainer>
  );
}