"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2, PenLine, Search, Sparkles, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import { cn } from "@/lib/utils";

import { useCreateHomework, useHomeworkOptions, useSectionStudents } from "../hooks/use-homework";
import { targetLabels } from "../lib/homework-utils";
import type { GeneratedQuestionPaper, HomeworkTargetType } from "../types/homework";
import { AiQuestionGenerator } from "./ai-question-generator";

const TARGETS: Array<{ value: HomeworkTargetType; hint: string }> = [
  { value: "CLASS", hint: "Every section you teach this subject in" },
  { value: "SECTION", hint: "All students of one section" },
  { value: "STUDENTS", hint: "Only the students you pick" },
];

type QuestionMode = "MANUAL" | "AI";

const MODES: Array<{ value: QuestionMode; label: string; hint: string; icon: LucideIcon }> = [
  { value: "MANUAL", label: "Write it myself", hint: "Type the homework and questions", icon: PenLine },
  { value: "AI", label: "Generate with AI", hint: "Pick question types, then review", icon: Sparkles },
];

function addDays(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  return toLocalDateKey(new Date(y!, m! - 1, d! + days));
}

export function CreateHomeworkDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const today = toLocalDateKey(new Date());
  const optionsQuery = useHomeworkOptions();
  const create = useCreateHomework();
  const classes = useMemo(() => optionsQuery.data ?? [], [optionsQuery.data]);

  const [target, setTarget] = useState<HomeworkTargetType>("SECTION");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [studentQuery, setStudentQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState(() => addDays(today, 1));
  const [maxMarks, setMaxMarks] = useState("10");
  const [allowLate, setAllowLate] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<QuestionMode>("MANUAL");
  const [aiPaper, setAiPaper] = useState<GeneratedQuestionPaper | null>(null);
  const [aiApproved, setAiApproved] = useState(false);

  const cls = classes.find((c) => c.class_id === classId);
  const subject = cls?.subjects.find((s) => s.subject_id === subjectId);
  const sections = subject?.sections ?? [];

  // Pick sensible defaults as the choices narrow down.
  useEffect(() => {
    if (!classId && classes[0]) setClassId(classes[0].class_id);
  }, [classes, classId]);
  useEffect(() => {
    if (cls && !cls.subjects.some((s) => s.subject_id === subjectId)) setSubjectId(cls.subjects[0]?.subject_id ?? "");
  }, [cls, subjectId]);
  useEffect(() => {
    if (subject && !subject.sections.some((s) => s.section_id === sectionId)) setSectionId(subject.sections[0]?.section_id ?? "");
  }, [subject, sectionId]);
  useEffect(() => setPicked(new Set()), [sectionId]);

  const studentsQuery = useSectionStudents(target === "STUDENTS" && sectionId ? sectionId : null);
  const students = studentsQuery.data ?? [];
  const visibleStudents = students.filter((s) =>
    `${s.name} ${s.roll_number} ${s.admission_number}`.toLowerCase().includes(studentQuery.trim().toLowerCase()),
  );

  const recipientCount =
    target === "CLASS"
      ? sections.reduce((sum, s) => sum + s.student_count, 0)
      : target === "SECTION"
        ? (sections.find((s) => s.section_id === sectionId)?.student_count ?? 0)
        : picked.size;

  const linkInvalid = Boolean(link.trim()) && !/^https?:\/\//i.test(link.trim());
  const marks = Number(maxMarks);
  const invalid =
    !classId ||
    !subjectId ||
    (target !== "CLASS" && !sectionId) ||
    (target === "STUDENTS" && picked.size === 0) ||
    !title.trim() ||
    (mode === "MANUAL" ? !description.trim() : !aiApproved) ||
    !dueDate ||
    dueDate < today ||
    !(marks > 0 && marks <= 1000) ||
    linkInvalid ||
    recipientCount === 0;

  function reset() {
    setTitle("");
    setDescription("");
    setInstructions("");
    setLink("");
    setPicked(new Set());
    setError(null);
    setMode("MANUAL");
    setAiPaper(null);
    setAiApproved(false);
  }

  const onAiApprovedChange = useCallback(
    (approved: boolean) => {
      setAiApproved(approved);
      // The paper's total becomes the homework's max marks (still editable).
      if (approved && aiPaper) setMaxMarks(String(aiPaper.total_marks));
    },
    [aiPaper],
  );

  function publishQuestionPaper() {
    if (invalid) return;
    // Saving AI question papers (and showing them to students, parents and the
    // principal) is not built yet — nothing is sent or stored here on purpose.
    toast.info("Publishing question papers is coming soon", {
      description: "Your approved questions were not saved.",
    });
  }

  function submit() {
    if (invalid || create.isPending) return;
    setError(null);
    create.mutate(
      {
        target_type: target,
        class_id: classId,
        subject_id: subjectId,
        section_id: target === "CLASS" ? null : sectionId,
        student_enrollment_ids: target === "STUDENTS" ? [...picked] : [],
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim() || null,
        assigned_date: today,
        due_date: dueDate,
        max_marks: marks,
        allow_late_submission: allowLate,
        attachment_url: link.trim() || null,
      },
      {
        onSuccess: (created) => {
          const total = created.reduce((sum, h) => sum + h.stats.recipients, 0);
          toast.success("Homework set", {
            description: `Sent to ${total} ${total === 1 ? "student" : "students"} and their parents.`,
          });
          reset();
          onOpenChange(false);
        },
        onError: (e) => setError(getErrorMessage(e)),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(calc(100svh-2rem),56rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(calc(100vw-2rem),76rem)]">
        <DialogHeader className="shrink-0 border-b p-5">
          <DialogTitle>Set homework</DialogTitle>
          <DialogDescription>Students and their parents are notified as soon as you set it.</DialogDescription>
        </DialogHeader>

        {optionsQuery.isLoading ? (
          <div className="flex flex-1 items-center justify-center p-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : classes.length === 0 ? (
          <p className="flex-1 p-8 text-center text-sm text-muted-foreground">
            You have no class and subject assigned yet, so there is nobody to set homework for.
          </p>
        ) : (
          /* Small screens: one scrolling column. Large: setup on the left, the
             homework / question paper on the right, each scrolling on its own. */
          <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:overflow-hidden">
            {/* Setup */}
            <div className="space-y-5 border-b p-5 lg:overflow-y-auto lg:border-r lg:border-b-0">
              {/* Who is it for */}
              <fieldset>
                <legend className="text-sm font-medium">Who is it for?</legend>
                <div className="mt-2 grid gap-2">
                  {TARGETS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      aria-pressed={target === t.value}
                      onClick={() => setTarget(t.value)}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-left transition-colors",
                        target === t.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50",
                      )}
                    >
                      <p className="text-sm font-medium">{targetLabels[t.value]}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.hint}</p>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Class" htmlFor="hw-class">
                  <NativeSelect id="hw-class" value={classId} onChange={setClassId} placeholder="Choose class">
                    {classes.map((c) => (
                      <option key={c.class_id} value={c.class_id}>
                        {c.class_name}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Subject" htmlFor="hw-subject">
                  <NativeSelect id="hw-subject" value={subjectId} onChange={setSubjectId} disabled={!cls} placeholder="Choose subject">
                    {(cls?.subjects ?? []).map((s) => (
                      <option key={s.subject_id} value={s.subject_id}>
                        {s.subject_name}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                {target !== "CLASS" && (
                  <Field label="Section" htmlFor="hw-section">
                    <NativeSelect id="hw-section" value={sectionId} onChange={setSectionId} disabled={!subject} placeholder="Choose section">
                      {sections.map((s) => (
                        <option key={s.section_id} value={s.section_id}>
                          Section {s.section_name} · {s.student_count} students
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                )}
              </div>

              {target === "CLASS" && sections.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Goes to {sections.map((s) => `Section ${s.section_name} (${s.student_count})`).join(", ")}.
                </p>
              )}

              {target === "STUDENTS" && (
                <div className="rounded-xl border">
                  <div className="flex items-center gap-2 border-b p-2">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={studentQuery}
                        onChange={(e) => setStudentQuery(e.target.value)}
                        placeholder="Search students"
                        aria-label="Search students"
                        className="h-8 pl-8"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPicked(picked.size === students.length ? new Set() : new Set(students.map((s) => s.enrollment_id)))
                      }
                      disabled={students.length === 0}
                    >
                      {picked.size === students.length && students.length > 0 ? "Clear" : "Select all"}
                    </Button>
                  </div>
                  <ul className="max-h-48 overflow-y-auto p-1">
                    {studentsQuery.isLoading ? (
                      <li className="p-3 text-center text-xs text-muted-foreground">Loading students…</li>
                    ) : visibleStudents.length === 0 ? (
                      <li className="p-3 text-center text-xs text-muted-foreground">No students found.</li>
                    ) : (
                      visibleStudents.map((s) => (
                        <li key={s.enrollment_id}>
                          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/60">
                            <input
                              type="checkbox"
                              className="size-4 accent-primary"
                              checked={picked.has(s.enrollment_id)}
                              onChange={(e) => {
                                const next = new Set(picked);
                                if (e.target.checked) next.add(s.enrollment_id);
                                else next.delete(s.enrollment_id);
                                setPicked(next);
                              }}
                            />
                            <span className="w-10 text-xs text-muted-foreground tabular-nums">{s.roll_number}</span>
                            <span className="min-w-0 flex-1 truncate">{s.name}</span>
                          </label>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* How the questions are added */}
              <fieldset>
                <legend className="text-sm font-medium">How do you want to add the questions?</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      aria-pressed={mode === m.value}
                      onClick={() => setMode(m.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                        mode === m.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50",
                      )}
                    >
                      <m.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span>
                        <span className="block text-sm font-medium">{m.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{m.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <Field label="Title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={255}
                  placeholder={mode === "AI" ? "e.g. Chapter 4 – Fractions (also used as the topic)" : "e.g. Fractions worksheet"}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Due date">
                  <Input type="date" value={dueDate} min={today} onChange={(e) => setDueDate(e.target.value)} />
                </Field>
                <Field label="Max marks">
                  <Input type="number" min={1} max={1000} value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
                </Field>
                <label className="col-span-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-primary" checked={allowLate} onChange={(e) => setAllowLate(e.target.checked)} />
                  Accept late work
                </label>
              </div>
              <Field label="Attachment link (optional)">
                <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" aria-invalid={linkInvalid || undefined} />
                {linkInvalid && <p className="mt-1 text-xs text-destructive">The link must start with http:// or https://</p>}
              </Field>

              {error && (
                <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* Workspace */}
            <div className="flex min-h-[28rem] flex-col bg-muted/20 lg:min-h-0">
              {mode === "MANUAL" ? (
                <div className="flex flex-1 flex-col gap-4 p-5 lg:overflow-y-auto">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor="hw-description" className="text-xs font-medium">
                      What to do
                    </label>
                    <Textarea
                      id="hw-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={5000}
                      placeholder="Describe the homework and write the questions"
                      className="min-h-48 flex-1 resize-none bg-background"
                    />
                    <p className="text-right text-2xs text-muted-foreground tabular-nums">{description.length} / 5000</p>
                  </div>
                  <Field label="Instructions (optional)" htmlFor="hw-instructions">
                    <Textarea
                      id="hw-instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      maxLength={5000}
                      rows={3}
                      className="bg-background"
                    />
                  </Field>
                </div>
              ) : (
                <AiQuestionGenerator
                  classId={classId}
                  subjectId={subjectId}
                  topic={title}
                  paper={aiPaper}
                  approved={aiApproved}
                  onPaperChange={setAiPaper}
                  onApprovedChange={onAiApprovedChange}
                />
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mx-0 mb-0 shrink-0 flex-col gap-2 border-t bg-popover p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {mode === "AI" && !aiApproved
              ? "Generate and approve the questions to publish."
              : recipientCount > 0
              ? `${recipientCount} ${recipientCount === 1 ? "student" : "students"} and their parents will be notified.`
              : "Choose who it is for."}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {mode === "AI" ? (
              <Button type="button" onClick={publishQuestionPaper} disabled={invalid}>
                Publish question paper
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={invalid || create.isPending}>
                {create.isPending && <Loader2 className="animate-spin" />}
                Set homework
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-xs font-medium">
          {label}
        </label>
      ) : (
        <p className="text-xs font-medium">{label}</p>
      )}
      {children}
    </div>
  );
}

/**
 * Native <select>: its list opens above everything, so it works inside the
 * modal dialog (a portalled dropdown would open behind it), and it is
 * keyboard / screen-reader friendly out of the box.
 */
function NativeSelect({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-input bg-transparent pr-8 pl-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
      >
        {!value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
