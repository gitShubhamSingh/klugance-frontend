"use client";

import { LoginCard } from "../components/login-card";

export function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-slate-950 text-white lg:flex">
        <div className="flex h-full w-full flex-col justify-between p-16">
          <div>
            <h1 className="text-4xl font-bold">
              Klugance
            </h1>

            <p className="mt-3 text-lg text-slate-300">
            School Portal
            </p>
          </div>

          <div className="max-w-lg">
            <h2 className="text-5xl font-bold leading-tight">
              Connect.
              <br />
              Teach.
              <br />
              Engage.
            </h2>

            <p className="mt-8 text-lg text-slate-300">
            Access everything you need for your school in one place classes, students, attendance, homework, exams, timetable, communication, and more.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            © 2026 Klugance Technologies
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-background p-8">
        <LoginCard />
      </section>
    </main>
  );
}