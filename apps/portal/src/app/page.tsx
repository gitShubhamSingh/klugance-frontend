import { redirect } from "next/navigation";

export default function Page() {
  // /dashboard is protected and renders the right experience for each role.
  redirect("/dashboard");
}
