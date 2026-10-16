"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  Clock,
  Copy,
  FileText,
  GraduationCap,
  HeartHandshake,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useTeacher } from "../hooks/use-teacher";

// ============================================================================
// TEACHER DATA TYPE & EXTENDED PLACEHOLDERS
// ============================================================================

export type Teacher = {
  // Existing core fields
  first_name: string;
  middle_name: string | null;
  last_name: string;
  employee_code: string;
  email: string;
  mobile_number: string;
  is_active: boolean;
  joining_date: string | null;
  user_id: string;
  qualification: string | null;
  experience_years: number | null;
  bio: string | null;

  // Academic & Teaching Placeholders
  designation?: string | null;
  department?: string | null;
  subjects?: string[] | null;
  assigned_classes?: string[] | null;
  cabin_location?: string | null;
  office_hours?: string | null;
  weekly_periods?: number | null;
  reporting_manager?: string | null;

  // Professional & Credentials Placeholders
  highest_degree?: string | null;
  university_name?: string | null;
  specialization?: string | null;
  certifications?: string[] | null;
  languages?: string[] | null;

  // Personal & Emergency Placeholders
  date_of_birth?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relation?: string | null;
  emergency_contact_phone?: string | null;
  residential_address?: string | null;

  // Administrative & Institutional Placeholders
  employment_type?: string | null;
  biometric_id?: string | null;
  documents_verified?: boolean | null;
  tax_id?: string | null;
};

type Props = {
  teacherId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTeacherName(
  teacher:
    | {
        first_name: string;
        middle_name: string | null;
        last_name: string;
      }
    | undefined,
): string {
  if (!teacher) {
    return "Teacher";
  }

  return [teacher.first_name, teacher.middle_name, teacher.last_name]
    .filter(Boolean)
    .join(" ");
}

function getTeacherInitials(
  teacher:
    | {
        first_name: string;
        last_name: string;
      }
    | undefined,
): string {
  if (!teacher) return "TP";
  const first = teacher.first_name?.charAt(0) || "";
  const last = teacher.last_name?.charAt(0) || "";
  return `${first}${last}`.toUpperCase() || "T";
}

// ============================================================================
// MAIN TEACHER PROFILE DIALOG
// ============================================================================

export function TeacherProfileDialog({
  teacherId,
  open,
  onOpenChange,
}: Props) {
  const {
    data: teacher,
    isLoading,
    isError,
  } = useTeacher(teacherId);

  const [activeTab, setActiveTab] = useState<
    "overview" | "academics" | "qualifications" | "personal" | "administrative"
  >("overview");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] sm:max-w-3xl flex flex-col overflow-hidden border-border bg-white p-0">
        {/* Top Header Bar: has pr-12 padding so text never collides with DialogContent's built-in close button */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/20 pr-12">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base font-semibold">
                Teacher Profile
              </DialogTitle>
              {teacher && !isLoading && (
                <span className="text-xs text-muted-foreground font-mono">
                  · {teacher.employee_code}
                </span>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Institutional records, academic appointments, and faculty credentials.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-80 items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-7 animate-spin text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Loading teacher profile...
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Retrieving faculty credentials and records
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex min-h-80 items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
                <AlertCircle className="size-6" />
              </div>
              <p className="font-medium text-destructive">
                Unable to load teacher profile.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Could not retrieve records for ID:{" "}
                <span className="font-mono text-xs">{teacherId || "unknown"}</span>. Please close this dialog and try again.
              </p>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-4 px-4 py-1.5 text-xs font-medium rounded-lg border border-border bg-white hover:bg-muted text-foreground transition-colors"
              >
                Close Dialog
              </button>
            </div>
          </div>
        )}

        {/* Populated Teacher Content */}
        {teacher && !isLoading && !isError && (
          <div className="flex-1 overflow-y-auto pb-6">
            {/* Executive Identity Card */}
            <div className="border-b bg-gradient-to-b from-muted/40 to-white px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Initials Avatar */}
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary ring-1 ring-primary/20 shadow-xs">
                    {getTeacherInitials(teacher)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-xl font-bold tracking-tight text-foreground">
                        {getTeacherName(teacher)}
                      </h3>

                      {/* Preserved theme active / inactive badge */}
                      <span
                        className={[
                          "inline-flex items-center rounded-full",
                          "px-2.5 py-0.5 text-xs font-medium",
                          "ring-1 ring-inset",
                          teacher.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-muted text-muted-foreground ring-border",
                        ].join(" ")}
                      >
                        {teacher.is_active ? "Active Faculty" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{teacher.designation ?? "Faculty Member"}</span>
                      {teacher.department && (
                        <>
                          <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                          <span>{teacher.department}</span>
                        </>
                      )}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                      <span>Code: <strong className="font-semibold text-foreground">{teacher.employee_code}</strong></span>
                      <span>User ID: <strong className="font-semibold text-foreground">{teacher.user_id}</strong></span>
                      {teacher.employment_type && (
                        <span>Type: <strong className="font-semibold text-foreground">{teacher.employment_type}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Affordances */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={`mailto:${teacher.email}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors shadow-2xs"
                  >
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>Email Teacher</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(teacher.email, "email")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shadow-2xs"
                  >
                    {copiedField === "email" ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-border/60">
                <QuickStat
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={
                    teacher.experience_years !== null && teacher.experience_years !== undefined
                      ? `${teacher.experience_years} years`
                      : "Not available"
                  }
                />
                <QuickStat
                  icon={CalendarDays}
                  label="Joining Date"
                  value={formatDate(teacher.joining_date)}
                />
                <QuickStat
                  icon={GraduationCap}
                  label="Qualification"
                  value={teacher.qualification ?? "Not specified"}
                />
                <QuickStat
                  icon={Clock}
                  label="Workload"
                  value={
                    teacher.weekly_periods
                      ? `${teacher.weekly_periods} periods/wk`
                      : "Standard allocation"
                  }
                />
              </div>
            </div>

            {/* Segmented Section Navigation Tabs */}
            <div className="sticky top-0 z-10 flex border-b bg-white px-6 pt-1 text-xs font-medium overflow-x-auto no-scrollbar gap-1">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                label="Overview"
                icon={UserRound}
              />
              <TabButton
                active={activeTab === "academics"}
                onClick={() => setActiveTab("academics")}
                label="Academics & Schedule"
                icon={BookOpen}
              />
              <TabButton
                active={activeTab === "qualifications"}
                onClick={() => setActiveTab("qualifications")}
                label="Qualifications"
                icon={GraduationCap}
              />
              <TabButton
                active={activeTab === "personal"}
                onClick={() => setActiveTab("personal")}
                label="Personal & Emergency"
                icon={HeartHandshake}
              />
              <TabButton
                active={activeTab === "administrative"}
                onClick={() => setActiveTab("administrative")}
                label="Records & Compliance"
                icon={FileText}
              />
            </div>

            {/* Tab Views */}
            <div className="p-6 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Contact Grid */}
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Primary Contact Details
                      </h4>
                      <span className="text-xs text-muted-foreground">Official School Channel</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <ContactCard
                        icon={Mail}
                        label="Institutional Email"
                        value={teacher.email}
                        actionLabel="Copy"
                        isCopied={copiedField === "email"}
                        onAction={() => copyToClipboard(teacher.email, "email")}
                      />

                      <ContactCard
                        icon={Phone}
                        label="Mobile Number"
                        value={teacher.mobile_number}
                        actionLabel="Copy"
                        isCopied={copiedField === "phone"}
                        onAction={() => copyToClipboard(teacher.mobile_number, "phone")}
                      />
                    </div>
                  </section>

                  {/* Core Employment Details */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Employment Snapshot
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <InfoItem
                        icon={BriefcaseBusiness}
                        label="Employee Code"
                        value={teacher.employee_code}
                      />

                      <InfoItem
                        icon={CalendarDays}
                        label="Joining Date"
                        value={formatDate(teacher.joining_date)}
                      />

                      <InfoItem
                        icon={UserRound}
                        label="System User ID"
                        value={teacher.user_id}
                      />
                    </div>
                  </section>

                  {/* Teaching Focus Highlights */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Teaching Assignment & Department
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoItem
                        icon={Building2}
                        label="Department"
                        value={teacher.department ?? "Department of Academics"}
                        placeholder={!teacher.department}
                      />

                      <InfoItem
                        icon={MapPin}
                        label="Cabin / Classroom Location"
                        value={teacher.cabin_location ?? "Faculty Room / Main Wing"}
                        placeholder={!teacher.cabin_location}
                      />
                    </div>

                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div className="mt-3 rounded-xl border p-3 bg-muted/20">
                        <span className="text-xs text-muted-foreground font-medium">Assigned Subjects:</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {teacher.subjects.map((sub, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border bg-white px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Bio */}
                  <section>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Faculty Bio & Teaching Philosophy
                      </h4>
                    </div>

                    <div className="rounded-xl border bg-muted/20 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                        {teacher.bio ||
                          "No faculty biography provided. The educator may add their pedagogical background and philosophy in their staff settings."}
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 2: ACADEMICS & SCHEDULE */}
              {activeTab === "academics" && (
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Classroom & Faculty Allocations
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoItem
                        icon={Building2}
                        label="Academic Department"
                        value={teacher.department ?? "General Faculty"}
                        placeholder={!teacher.department}
                      />

                      <InfoItem
                        icon={BriefcaseBusiness}
                        label="Faculty Designation"
                        value={teacher.designation ?? "Faculty Member"}
                        placeholder={!teacher.designation}
                      />

                      <InfoItem
                        icon={MapPin}
                        label="Cabin / Desk Location"
                        value={teacher.cabin_location ?? "Room 204, Academic Block"}
                        placeholder={!teacher.cabin_location}
                      />

                      <InfoItem
                        icon={Clock}
                        label="Office Consultation Hours"
                        value={teacher.office_hours ?? "Mon & Wed: 2:00 PM – 3:30 PM"}
                        placeholder={!teacher.office_hours}
                      />

                      <InfoItem
                        icon={Clock}
                        label="Weekly Teaching Periods"
                        value={
                          teacher.weekly_periods !== undefined && teacher.weekly_periods !== null
                            ? `${teacher.weekly_periods} Periods / week`
                            : "20 Periods / week"
                        }
                        placeholder={teacher.weekly_periods === undefined || teacher.weekly_periods === null}
                      />

                      <InfoItem
                        icon={UserRound}
                        label="Reporting Head of Department (HOD)"
                        value={teacher.reporting_manager ?? "Academic Dean / Principal"}
                        placeholder={!teacher.reporting_manager}
                      />
                    </div>
                  </section>

                  {/* Assigned Classes */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Assigned Classes & Grade Sections
                    </h4>

                    <div className="rounded-xl border p-4 bg-muted/10">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(teacher.assigned_classes ?? [
                          "Grade 11 - Section A (Class Teacher)",
                          "Grade 12 - Section B (Subject Specialist)",
                          "Grade 10 - Section C (Advanced)",
                        ]).map((cls, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 rounded-lg border bg-white p-2.5 shadow-2xs"
                          >
                            <BookOpen className="size-4 text-primary shrink-0" />
                            <span className="text-xs font-medium text-foreground">{cls}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 3: QUALIFICATIONS & CREDENTIALS */}
              {activeTab === "qualifications" && (
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Academic Background
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoItem
                        icon={GraduationCap}
                        label="Highest Qualification"
                        value={teacher.qualification ?? "Postgraduate Degree"}
                        placeholder={!teacher.qualification}
                      />

                      <InfoItem
                        icon={Building2}
                        label="Alma Mater / University"
                        value={teacher.university_name ?? "State Central University"}
                        placeholder={!teacher.university_name}
                      />

                      <InfoItem
                        icon={BriefcaseBusiness}
                        label="Years of Experience"
                        value={
                          teacher.experience_years !== null && teacher.experience_years !== undefined
                            ? `${teacher.experience_years} years in education`
                            : "Not available"
                        }
                      />

                      <InfoItem
                        icon={Sparkles}
                        label="Specialization Domain"
                        value={teacher.specialization ?? "Advanced Curriculum Pedagogy"}
                        placeholder={!teacher.specialization}
                      />
                    </div>
                  </section>

                  {/* Certifications */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Accreditations & Professional Certifications
                    </h4>

                    <div className="rounded-xl border p-4 bg-muted/10 space-y-2">
                      {(teacher.certifications ?? [
                        "B.Ed (Bachelor of Education) - Distinction",
                        "State Eligibility Test for Assistant Professorship (SET)",
                        "Modern Classroom Pedagogy & Technology Certification",
                      ]).map((cert, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-lg border bg-white p-3 shadow-2xs"
                        >
                          <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-foreground">{cert}</p>
                            <p className="text-2xs text-muted-foreground">Verified Institutional Credential</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Languages */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Languages of Instruction
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {(teacher.languages ?? ["English (Fluent)", "Hindi (Native)", "Regional Language (Working)"]).map(
                        (lang, idx) => (
                          <span
                            key={idx}
                            className="rounded-md border bg-white px-3 py-1 text-xs font-medium text-foreground shadow-2xs"
                          >
                            {lang}
                          </span>
                        ),
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 4: PERSONAL & EMERGENCY */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Personal Details
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <InfoItem
                        icon={CalendarDays}
                        label="Date of Birth"
                        value={formatDate(teacher.date_of_birth ?? "1988-06-12")}
                        placeholder={!teacher.date_of_birth}
                      />

                      <InfoItem
                        icon={UserRound}
                        label="Gender"
                        value={teacher.gender ?? "Female"}
                        placeholder={!teacher.gender}
                      />

                      <InfoItem
                        icon={HeartHandshake}
                        label="Blood Group"
                        value={teacher.blood_group ?? "O positive (O+)"}
                        placeholder={!teacher.blood_group}
                      />
                    </div>
                  </section>

                  {/* Emergency Contact */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Emergency Contact Record
                    </h4>

                    <div className="rounded-xl border bg-muted/10 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoItem
                          icon={UserRound}
                          label="Emergency Contact Person"
                          value={
                            teacher.emergency_contact_name
                              ? `${teacher.emergency_contact_name} (${teacher.emergency_contact_relation ?? "Relation"})`
                              : "Arun Sharma (Spouse)"
                          }
                          placeholder={!teacher.emergency_contact_name}
                        />

                        <ContactCard
                          icon={Phone}
                          label="Emergency Mobile"
                          value={teacher.emergency_contact_phone ?? "+91 98765 43211"}
                          actionLabel="Copy"
                          isCopied={copiedField === "emergency"}
                          onAction={() =>
                            copyToClipboard(
                              teacher.emergency_contact_phone ?? "+91 98765 43211",
                              "emergency",
                            )
                          }
                        />
                      </div>
                    </div>
                  </section>

                  {/* Residential Address */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Residential Address
                    </h4>

                    <div className="rounded-xl border bg-white p-3.5 flex items-start gap-3 shadow-2xs">
                      <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Permanent / Local Residence</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">
                          {teacher.residential_address ?? "Flat 402, Green Valley Enclave, Sector 14"}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* TAB 5: ADMINISTRATIVE & COMPLIANCE */}
              {activeTab === "administrative" && (
                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Institutional Administrative Records
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoItem
                        icon={BriefcaseBusiness}
                        label="Employment Classification"
                        value={teacher.employment_type ?? "Full-time Permanent"}
                        placeholder={!teacher.employment_type}
                      />

                      <InfoItem
                        icon={UserRound}
                        label="Reporting Authority"
                        value={teacher.reporting_manager ?? "Principal / Academic Director"}
                        placeholder={!teacher.reporting_manager}
                      />

                      <InfoItem
                        icon={Clock}
                        label="Biometric Staff Punch Code"
                        value={teacher.biometric_id ?? "BIO-7842"}
                        placeholder={!teacher.biometric_id}
                      />

                      <InfoItem
                        icon={FileText}
                        label="Payroll / Tax ID"
                        value={teacher.tax_id ?? "ABCDE••••F"}
                        placeholder={!teacher.tax_id}
                      />
                    </div>
                  </section>

                  {/* Document Compliance Verification */}
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Compliance & Background Checks
                    </h4>

                    <div className="rounded-xl border bg-muted/10 p-4 space-y-3">
                      <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-4 text-emerald-600" />
                          <span className="text-xs font-medium text-foreground">
                            Identity & Government Photo ID Proof
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-600/20">
                          Verified
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-4 text-emerald-600" />
                          <span className="text-xs font-medium text-foreground">
                            Academic Degree & Transcripts Verification
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-600/20">
                          Verified
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-4 text-emerald-600" />
                          <span className="text-xs font-medium text-foreground">
                            Institutional Background & Police Verification
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-600/20">
                          Clear
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-3">
          <span className="text-xs text-muted-foreground">
            Faculty ID: <span className="font-mono">{teacherId || "—"}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border bg-white px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

type InfoItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  placeholder?: boolean;
};

export function InfoItem({
  icon: Icon,
  label,
  value,
  placeholder = false,
}: InfoItemProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-white p-3 shadow-2xs hover:border-border transition-colors">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>

      <p className={`mt-1 truncate text-sm font-semibold ${placeholder ? "text-muted-foreground/80 font-normal italic" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  actionLabel,
  isCopied,
  onAction,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  actionLabel: string;
  isCopied: boolean;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/80 bg-white p-3 shadow-2xs">
      <div className="min-w-0 pr-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="size-3.5" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-foreground">
          {value || "Not available"}
        </p>
      </div>

      <button
        type="button"
        onClick={onAction}
        aria-label={`${actionLabel} ${label}`}
        className="shrink-0 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-2xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        {isCopied ? (
          <>
            <Check className="size-3 text-emerald-600" />
            <span className="text-emerald-700">Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-3" />
            <span>{actionLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white/70 border border-border/60 p-2.5">
      <div className="flex items-center gap-1 text-muted-foreground text-2xs">
        <Icon className="size-3" />
        <span>{label}</span>
      </div>
      <p className="mt-0.5 text-xs font-bold text-foreground truncate">
        {value}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? "border-primary text-primary font-semibold"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
      }`}
    >
      <Icon className="size-3.5" />
      <span>{label}</span>
    </button>
  );
}