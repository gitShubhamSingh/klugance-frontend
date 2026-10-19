
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  School,
  UserRound,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/common/page-header";

const teacher = {
  name: "Teacher",
  teacherId: "—",
  email: "—",
  designation: "Teacher",
  status: "Active",
};

const metrics = [
  {
    title: "Assigned Classes",
    value: "—",
    description: "Classes assigned to you",
    icon: School,
  },
  {
    title: "Subjects",
    value: "—",
    description: "Subjects you teach",
    icon: BookOpen,
  },
  {
    title: "Today's Periods",
    value: "—",
    description: "Total periods scheduled today",
    icon: CalendarClock,
  },
  {
    title: "Remaining Periods",
    value: "—",
    description: "Periods left in today's schedule",
    icon: Clock3,
  },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-7">
        <PageHeader
          title="Teacher Dashboard"
          description="Your teaching assignments and daily schedule, all in one place."
        />

        {/* Teacher profile */}
        <section className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="h-1.5 bg-primary" />

          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound className="size-8" />
              </div>

              <div className="min-w-0 space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Welcome back
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {teacher.name}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {teacher.designation}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
                    <GraduationCap className="size-3.5" />
                    Teacher Portal
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    {teacher.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[340px]">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound className="size-4" />
                  Teacher ID
                </div>
                <p className="mt-2 font-medium">{teacher.teacherId}</p>
              </div>

              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  Email address
                </div>
                <p className="mt-2 truncate font-medium" title={teacher.email}>
                  {teacher.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Assignment and timetable metrics */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Your Overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick summary of your teaching responsibilities.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.title}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </span>

                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-semibold tracking-tight">
                    {metric.value}
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Current period and today's schedule */}
        <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
          <section className="overflow-hidden rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold tracking-tight">
                  Current Period
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your active classroom session
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 className="size-5" />
              </div>
            </div>

            <div className="p-5">
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-5 py-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <CalendarClock className="size-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-medium">
                  No active period information
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Your current class, subject, section, room, and timing will
                  appear here when timetable data is connected.
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted/40 p-4">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Classroom and room details will be shown when available.
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold tracking-tight">
                  Upcoming Periods
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your remaining schedule for today
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </div>
            </div>

            <div className="p-5">
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-5 py-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="size-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-medium">
                  Your schedule will appear here
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Upcoming periods will show their time, subject, class,
                  section, and room once the timetable is available.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" />
                <span>Schedule information depends on assigned periods.</span>
                <ArrowRight className="ml-auto size-4 shrink-0" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
