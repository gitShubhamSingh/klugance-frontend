
import { redirect } from "next/navigation";

export default function Page() {
  // Temporary default until role-aware authentication is implemented.
  redirect("/teacher/dashboard");
}
