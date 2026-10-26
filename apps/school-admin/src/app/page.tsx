import {
    redirect,
  } from "next/navigation";

  export default function HomePage() {
    // /dashboard is protected: signed-out visitors are sent to /login by proxy.ts.
    redirect("/dashboard");
  }
