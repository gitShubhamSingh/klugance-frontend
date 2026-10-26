/**
 * Accent tones used to tag subjects, classes and categories on the dashboards.
 * The portal follows the neutral school-admin look for now, so every tone maps
 * to the same neutral style; give tones their own colours here if a redesign
 * brings colour back. Class names are written out in full so Tailwind can detect them.
 */
export type Tone =
  | "blue"
  | "rose"
  | "emerald"
  | "amber"
  | "violet"
  | "cyan"
  | "orange"
  | "indigo";

type ToneStyle = {
  soft: string;
  text: string;
  solid: string;
  border: string;
  hex: string;
};

const neutral: ToneStyle = {
  soft: "bg-muted",
  text: "text-foreground",
  solid: "bg-primary",
  border: "border-border",
  hex: "var(--primary)",
};

export const toneStyles: Record<Tone, ToneStyle> = {
  blue: neutral,
  rose: neutral,
  emerald: neutral,
  amber: neutral,
  violet: neutral,
  cyan: neutral,
  orange: neutral,
  indigo: neutral,
};
