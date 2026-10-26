"use client";

import { useState, type ReactNode } from "react";
import {
  Cake,
  CalendarCheck2,
  Check,
  Copy,
  Droplet,
  GraduationCap,
  Hash,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { Student } from "../types";

type Props = {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: shows an "Edit student" button in the footer. */
  onEdit?: (student: Student) => void;
};

/* ── helpers ─────────────────────────────────────────────────────── */

function getStudentName(student: Student) {
  return [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");
}

function getInitials(student: Student) {
  return `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`.toUpperCase();
}

function formatGender(gender: Student["gender"]) {
  if (!gender) return null;
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string | null | undefined) {
  const date = parseDate(value);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Age in whole years, calculated from the date of birth. */
function getAge(dateOfBirth: string | null) {
  const dob = parseDate(dateOfBirth);
  if (!dob) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthday) age -= 1;
  return age >= 0 ? age : null;
}

/* ── component ───────────────────────────────────────────────────── */

export function StudentProfileDialog({ student, open, onOpenChange, onEdit }: Props) {
  if (!student) {
    return null;
  }

  const name = getStudentName(student);
  const classLabel =
    [student.class_name, student.section_name].filter(Boolean).join(" – ") || null;
  const age = getAge(student.date_of_birth);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100svh-2rem)] gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        {/* ── Branded header ─────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-primary px-5 pt-5 pb-6 text-primary-foreground sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-primary-foreground/10 blur-3xl"
          />

          <div className="relative flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-primary-foreground/70 uppercase">
              <GraduationCap className="size-3.5" />
              Student profile
            </span>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                />
              }
            >
              <X />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div className="relative mt-4 flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground text-xl font-semibold text-primary shadow-lg sm:size-18">
              {getInitials(student)}
            </div>

            <div className="min-w-0">
              <DialogTitle className="truncate text-xl font-semibold text-primary-foreground sm:text-2xl">
                {name}
              </DialogTitle>
              <DialogDescription className="mt-0.5 truncate text-sm text-primary-foreground/70">
                {student.email}
              </DialogDescription>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    student.is_active
                      ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/30 dark:text-emerald-700"
                      : "bg-primary-foreground/10 text-primary-foreground/70 ring-1 ring-primary-foreground/20",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      student.is_active ? "bg-emerald-400" : "bg-primary-foreground/50",
                    )}
                  />
                  {student.is_active ? "Active" : "Inactive"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-medium ring-1 ring-primary-foreground/15">
                  <Hash className="size-3" />
                  {student.admission_number}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="overflow-y-auto">
          {/* Quick facts */}
          <div className="grid grid-cols-3 divide-x border-b">
            <QuickFact label="Class" value={classLabel ?? "Not assigned"} muted={!classLabel} />
            <QuickFact
              label="Admitted"
              value={formatDate(student.admission_date) ?? "—"}
              muted={!student.admission_date}
            />
            <QuickFact
              label="Age"
              value={age !== null ? `${age} years` : "—"}
              muted={age === null}
            />
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
            <Section title="Personal details">
              <Field icon={Cake} label="Date of birth" value={formatDate(student.date_of_birth)} />
              <Field icon={UserRound} label="Gender" value={formatGender(student.gender)} />
              <Field icon={Droplet} label="Blood group" value={student.blood_group} />
            </Section>

            <Section title="Contact">
              <Field
                icon={Mail}
                label="Email"
                value={student.email}
                href={student.email ? `mailto:${student.email}` : undefined}
                copyable
              />
              <Field
                icon={Phone}
                label="Mobile number"
                value={student.mobile_number}
                href={student.mobile_number ? `tel:${student.mobile_number.replace(/\s/g, "")}` : undefined}
                copyable
              />
            </Section>

            <Section title="Admission" className="sm:col-span-2">
              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field icon={Hash} label="Admission number" value={student.admission_number} copyable />
                <Field
                  icon={CalendarCheck2}
                  label="Admission date"
                  value={formatDate(student.admission_date)}
                />
                <Field icon={GraduationCap} label="Class & section" value={classLabel} />
                <Field
                  icon={ShieldCheck}
                  label="Status"
                  value={student.is_active ? "Active" : "Inactive"}
                />
              </div>
            </Section>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-5 py-3 sm:px-6">
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <span className="flex size-4 items-center justify-center rounded bg-primary text-primary-foreground">
              <GraduationCap className="size-2.5" />
            </span>
            Klugance · Student record
          </span>
          <div className="flex w-full gap-2 sm:w-auto">
            <DialogClose render={<Button variant="outline" className="flex-1 sm:flex-none" />}>
              Close
            </DialogClose>
            {onEdit && (
              <Button type="button" className="flex-1 sm:flex-none" onClick={() => onEdit(student)}>
                <Pencil />
                Edit student
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── building blocks ─────────────────────────────────────────────── */

function QuickFact({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="min-w-0 px-4 py-3.5 text-center sm:px-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 truncate text-sm font-semibold", muted && "font-medium text-muted-foreground")}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h3 className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="divide-y">{children}</div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  href,
  copyable,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  href?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available — ignore silently.
    }
  }

  return (
    <div className="group flex items-center gap-3 py-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {value ? (
          href ? (
            <a href={href} className="block truncate text-sm font-medium underline-offset-4 hover:underline">
              {value}
            </a>
          ) : (
            <p className="truncate text-sm font-medium">{value}</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Not provided</p>
        )}
      </div>
      {copyable && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
          className="shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        >
          {copied ? <Check className="text-emerald-600" /> : <Copy />}
        </Button>
      )}
    </div>
  );
}
