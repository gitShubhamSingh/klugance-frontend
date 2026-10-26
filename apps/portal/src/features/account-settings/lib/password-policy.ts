/**
 * Password policy — mirrors the backend rules already enforced in
 * school-admin's change-password form.
 */

export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  { id: "length", label: "At least 12 characters", test: (p) => p.length >= 12 },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character", test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

/** Hard limits that aren't shown as checklist items. */
export function getPasswordLimitError(password: string): string | null {
  if (password.length > 128) return "Your new password must not exceed 128 characters.";
  if (new TextEncoder().encode(password).length > 72) {
    return "Your new password is too long (maximum 72 bytes).";
  }
  return null;
}

export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string };

export function getPasswordStrength(password: string): Strength {
  if (!password) return { score: 0, label: "" };
  const passed = passwordRules.filter((r) => r.test(password)).length;
  const bonus = password.length >= 16 ? 1 : 0;
  const score = Math.min(4, Math.max(1, passed - 1 + bonus)) as Strength["score"];
  const labels: Record<Strength["score"], string> = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };
  return { score, label: labels[score] };
}
