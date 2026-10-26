import { redirect } from "next/navigation";

// The dashboard now lives at the shared /dashboard route.
export default function StudentDashboardPage() {
  redirect("/dashboard");
}
