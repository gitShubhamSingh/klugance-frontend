"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  FileQuestion,
  Loader2,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/core/api/get-error-message";
import { cn } from "@/lib/utils";

import { generateQuestions } from "../api/homework";
import { useGenerateQuestions } from "../hooks/use-homework";
import type { GeneratedQuestion, GeneratedQuestionPaper, GeneratedQuestionType, QuestionCounts } from "../types/homework";

// Keep in sync with MAX_PER_TYPE / MAX_TOTAL on the API.
const MAX_PER_TYPE = 20;
const MAX_TOTAL = 50;

const TYPES: Array<{ type: GeneratedQuestionType; key: keyof QuestionCounts; label: string; short: string }> = [
  { type: "OBJECTIVE", key: "objective_count", label: "Objective", short: "MCQ" },
  { type: "FILL_IN_THE_BLANK", key: "fill_in_the_blank_count", label: "Fill in the blanks", short: "Blanks" },
  { type: "SHORT", key: "short_count", label: "Short answer", short: "Short" },
  { type: "LONG", key: "long_count", label: "Long answer", short: "Long" },
];

const DEFAULT_COUNTS: QuestionCounts = {
  objective_count: 5,
  fill_in_the_blank_count: 3,
  short_count: 2,
  long_count: 1,
};

const NO_COUNTS: QuestionCounts = { objective_count: 0, fill_in_the_blank_count: 0, short_count: 0, long_count: 0 };

type Props = {
  classId: string;
  subjectId: string;
  topic: string;
  paper: GeneratedQuestionPaper | null;
  approved: boolean;
  onPaperChange: (paper: GeneratedQuestionPaper | null) => void;
  onApprovedChange: (approved: boolean) => void;
};

function withTotals(questions: GeneratedQuestion[], topic: string | null): GeneratedQuestionPaper {
  return { topic, questions, total_marks: questions.reduce((sum, q) => sum + q.marks, 0) };
}

/**
 * Right-hand workspace of the "Set homework" dialog in AI mode: choose the
 * question mix, generate, then review the paper question by question (edit,
 * regenerate or remove any of them) before approving it.
 */
export function AiQuestionGenerator({ classId, subjectId, topic, paper, approved, onPaperChange, onApprovedChange }: Props) {
  const generate = useGenerateQuestions();
  const [counts, setCounts] = useState<QuestionCounts>(DEFAULT_COUNTS);
  const [generatedFor, setGeneratedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  // Per-question regeneration resolves later; it must patch the newest paper, not a stale copy.
  const latestPaper = useRef(paper);
  latestPaper.current = paper;

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const requestKey = JSON.stringify([classId, subjectId, counts]);
  const stale = paper !== null && generatedFor !== requestKey;
  const busy = generate.isPending || regenerating.size > 0;
  const canGenerate = Boolean(classId && subjectId) && total > 0 && total <= MAX_TOTAL && !busy;

  // An approval only holds for the paper as generated (e.g. not after the class changes).
  useEffect(() => {
    if (stale && approved) onApprovedChange(false);
  }, [stale, approved, onApprovedChange]);

  function setCount(key: keyof QuestionCounts, value: number) {
    const next = Math.max(0, Math.min(MAX_PER_TYPE, Number.isFinite(value) ? Math.trunc(value) : 0));
    setCounts((c) => ({ ...c, [key]: next }));
  }

  function updatePaper(questions: GeneratedQuestion[]) {
    onPaperChange(withTotals(questions, paper?.topic ?? null));
    onApprovedChange(false);
  }

  function runAll() {
    if (!canGenerate) return;
    setError(null);
    setEditingId(null);
    onApprovedChange(false);
    generate.mutate(
      { class_id: classId, subject_id: subjectId, topic: topic.trim() || null, ...counts },
      {
        onSuccess: (result) => {
          onPaperChange(result);
          setGeneratedFor(requestKey);
          scrollRef.current?.scrollTo({ top: 0 });
        },
        onError: (e) => setError(getErrorMessage(e, "Couldn't generate questions. Please try again.")),
      },
    );
  }

  async function regenerateOne(question: GeneratedQuestion) {
    if (!paper) return;
    const key = TYPES.find((t) => t.type === question.type)!.key;
    setRegenerating((s) => new Set(s).add(question.id));
    try {
      const result = await generateQuestions({
        class_id: classId,
        subject_id: subjectId,
        topic: topic.trim() || null,
        ...NO_COUNTS,
        [key]: 1,
      });
      const replacement = result.questions[0];
      if (!replacement) throw new Error("No question came back. Please try again.");
      // Read the latest paper: other questions may have changed meanwhile.
      onPaperChange(
        withTotals(
          (latestPaper.current?.questions ?? []).map((q) => (q.id === question.id ? replacement : q)),
          latestPaper.current?.topic ?? null,
        ),
      );
      onApprovedChange(false);
    } catch (e) {
      toast.error(getErrorMessage(e, "Couldn't regenerate that question."));
    } finally {
      setRegenerating((s) => {
        const next = new Set(s);
        next.delete(question.id);
        return next;
      });
    }
  }

  function jumpTo(type: GeneratedQuestionType) {
    document.getElementById(`ai-section-${type}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let number = 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Question mix */}
      <div className="shrink-0 space-y-3 border-b bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Question mix</p>
            <p className={cn("text-xs tabular-nums", total > MAX_TOTAL ? "text-destructive" : "text-muted-foreground")}>
              {total} of {MAX_TOTAL} questions · up to {MAX_PER_TYPE} per type
            </p>
          </div>
          <Button type="button" size="sm" variant={paper ? "outline" : "default"} onClick={runAll} disabled={!canGenerate}>
            {generate.isPending ? <Loader2 className="animate-spin" /> : paper ? <RefreshCw /> : <Sparkles />}
            {paper ? "Regenerate all" : "Generate"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          {TYPES.map((t) => (
            <CountStepper
              key={t.key}
              id={`ai-${t.key}`}
              label={t.label}
              value={counts[t.key]}
              disabled={busy}
              onChange={(v) => setCount(t.key, v)}
            />
          ))}
        </div>
        {stale && !generate.isPending && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
            The question mix or class changed. Regenerate all to apply it.
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      {/* Paper */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {generate.isPending ? (
          <div role="status" aria-live="polite" className="mx-auto max-w-3xl space-y-5 p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="size-4 animate-spin" />
              Generating {total} {total === 1 ? "question" : "questions"}…
            </p>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2 rounded-xl border bg-background p-4">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : !paper ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="size-6 text-muted-foreground" />
            </span>
            <div>
              <p className="font-medium">No questions yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Set how many questions of each type you want, then generate. You can edit, regenerate or remove any
                question before approving.
              </p>
            </div>
            <Button type="button" onClick={runAll} disabled={!canGenerate}>
              <Sparkles />
              Generate {total} {total === 1 ? "question" : "questions"}
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl p-5">
            {/* Paper header */}
            <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-4 border-b bg-muted/80 px-5 py-3 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{paper.topic || "Question paper"}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {paper.questions.length} questions · {paper.total_marks} marks
                  </p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAnswers((v) => !v)}>
                  {showAnswers ? <EyeOff /> : <Eye />}
                  {showAnswers ? "Hide answers" : "Show answers"}
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TYPES.map((t) => {
                  const n = paper.questions.filter((q) => q.type === t.type).length;
                  if (n === 0) return null;
                  return (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => jumpTo(t.type)}
                      className="rounded-full border bg-background px-2.5 py-0.5 text-xs transition-colors hover:bg-muted"
                    >
                      {t.short} · {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {paper.questions.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                You removed every question. Regenerate all to start again.
              </p>
            ) : (
              <div className="space-y-6">
                {TYPES.map((t) => {
                  const items = paper.questions.filter((q) => q.type === t.type);
                  if (items.length === 0) return null;
                  const marks = items.reduce((sum, q) => sum + q.marks, 0);

                  return (
                    <section key={t.type} id={`ai-section-${t.type}`} className="scroll-mt-28">
                      <h4 className="flex items-baseline justify-between text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {t.label}
                        <span className="font-normal normal-case tabular-nums">
                          {items.length} {items.length === 1 ? "question" : "questions"} · {marks} marks
                        </span>
                      </h4>
                      <ol className="mt-2 space-y-2">
                        {items.map((q) => {
                          number += 1;
                          return (
                            <QuestionCard
                              key={q.id}
                              number={number}
                              question={q}
                              showAnswer={showAnswers}
                              editing={editingId === q.id}
                              regenerating={regenerating.has(q.id)}
                              disabled={generate.isPending}
                              onEdit={() => setEditingId(q.id)}
                              onCancelEdit={() => setEditingId(null)}
                              onSave={(next) => {
                                updatePaper(paper.questions.map((x) => (x.id === q.id ? next : x)));
                                setEditingId(null);
                              }}
                              onRegenerate={() => regenerateOne(q)}
                              onRemove={() => updatePaper(paper.questions.filter((x) => x.id !== q.id))}
                            />
                          );
                        })}
                      </ol>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval */}
      {paper && !generate.isPending && (
        <div className="flex shrink-0 flex-col gap-2 border-t bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {approved ? (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <Check className="size-4" />
              Approved · {paper.total_marks} marks
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {editingId
                ? "Save or cancel your edit to approve."
                : "Check every question, then approve the paper."}
            </p>
          )}
          {approved ? (
            <Button type="button" variant="outline" size="sm" onClick={() => onApprovedChange(false)}>
              Undo approval
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => onApprovedChange(true)}
              disabled={stale || busy || Boolean(editingId) || paper.questions.length === 0}
            >
              <Check />
              Approve questions
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  number,
  question,
  showAnswer,
  editing,
  regenerating,
  disabled,
  onEdit,
  onCancelEdit,
  onSave,
  onRegenerate,
  onRemove,
}: {
  number: number;
  question: GeneratedQuestion;
  showAnswer: boolean;
  editing: boolean;
  regenerating: boolean;
  disabled: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (question: GeneratedQuestion) => void;
  onRegenerate: () => void;
  onRemove: () => void;
}) {
  return (
    <li
      className={cn(
        "group rounded-xl border bg-background p-4 transition-colors",
        editing && "ring-1 ring-primary",
        regenerating && "opacity-60",
      )}
    >
      <div className="flex gap-3">
        <span className="w-6 shrink-0 pt-0.5 text-right text-sm font-medium tabular-nums text-muted-foreground">
          {number}.
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <QuestionEditor question={question} onCancel={onCancelEdit} onSave={onSave} />
          ) : (
            <>
              <p className="text-sm leading-relaxed">{question.question}</p>
              {question.options.length > 0 && (
                <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {question.options.map((option, i) => (
                    <li
                      key={`${i}-${option}`}
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-sm",
                        showAnswer && option === question.answer
                          ? "border-emerald-500/40 bg-emerald-500/5"
                          : "text-muted-foreground",
                      )}
                    >
                      <span className="mr-1.5 font-medium">{String.fromCharCode(97 + i)})</span>
                      {option}
                    </li>
                  ))}
                </ol>
              )}
              {showAnswer && question.answer && question.options.length === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Answer:</span> {question.answer}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-2xs font-medium tabular-nums">
            {question.marks} {question.marks === 1 ? "mark" : "marks"}
          </span>
          {!editing && (
            <div className="flex gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Edit question ${number}`}
                onClick={onEdit}
                disabled={disabled || regenerating}
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Regenerate question ${number}`}
                onClick={onRegenerate}
                disabled={disabled || regenerating}
              >
                <RefreshCw className={cn(regenerating && "animate-spin")} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove question ${number}`}
                onClick={onRemove}
                disabled={disabled || regenerating}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function QuestionEditor({
  question,
  onCancel,
  onSave,
}: {
  question: GeneratedQuestion;
  onCancel: () => void;
  onSave: (question: GeneratedQuestion) => void;
}) {
  const [text, setText] = useState(question.question);
  const [options, setOptions] = useState(question.options);
  const [answer, setAnswer] = useState(question.answer ?? "");
  const isObjective = question.options.length > 0;

  const filledOptions = options.map((o) => o.trim());
  const valid =
    text.trim().length > 0 &&
    (!isObjective || (filledOptions.every(Boolean) && new Set(filledOptions).size === filledOptions.length));

  function save() {
    if (!valid) return;
    onSave({
      ...question,
      question: text.trim(),
      options: filledOptions,
      answer: answer.trim() || null,
    });
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        aria-label="Question"
        autoFocus
        className="text-sm"
      />

      {isObjective ? (
        <fieldset className="space-y-1.5">
          <legend className="mb-1 text-xs font-medium">Options — select the correct one</legend>
          {options.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`answer-${question.id}`}
                className="size-4 accent-primary"
                aria-label={`Option ${String.fromCharCode(97 + i)} is correct`}
                checked={answer === option && option !== ""}
                onChange={() => setAnswer(option)}
              />
              <Input
                value={option}
                aria-label={`Option ${String.fromCharCode(97 + i)}`}
                onChange={(e) => {
                  const value = e.target.value;
                  setOptions((prev) => prev.map((o, j) => (j === i ? value : o)));
                  if (answer === option) setAnswer(value);
                }}
                className="h-8"
              />
            </div>
          ))}
          {!valid && <p className="text-xs text-destructive">Every option needs different, non-empty text.</p>}
        </fieldset>
      ) : (
        <div className="space-y-1.5">
          <label htmlFor={`answer-${question.id}`} className="block text-xs font-medium">
            Answer / marking hint (optional)
          </label>
          <Input id={`answer-${question.id}`} value={answer} onChange={(e) => setAnswer(e.target.value)} className="h-8" />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X />
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={save} disabled={!valid}>
          <Check />
          Save
        </Button>
      </div>
    </div>
  );
}

function CountStepper({
  id,
  label,
  value,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5">
      <label htmlFor={id} className="min-w-0 truncate text-xs font-medium">
        {label}
      </label>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Fewer ${label.toLowerCase()} questions`}
          onClick={() => onChange(value - 1)}
          disabled={disabled || value <= 0}
        >
          <Minus />
        </Button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_PER_TYPE}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="h-6 w-8 rounded-md border border-input bg-transparent text-center text-xs tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`More ${label.toLowerCase()} questions`}
          onClick={() => onChange(value + 1)}
          disabled={disabled || value >= MAX_PER_TYPE}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
