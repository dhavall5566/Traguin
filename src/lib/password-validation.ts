export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRequirement = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "letter",
    label: "At least one letter",
    test: (password) => /[A-Za-z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "At least one symbol (!@#$…)",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3;
  label: string;
};

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "" };

  const metCount = PASSWORD_REQUIREMENTS.filter((req) => req.test(password)).length;
  if (metCount < PASSWORD_REQUIREMENTS.length) {
    return { score: 1, label: "Weak" };
  }
  if (password.length >= 12) {
    return { score: 3, label: "Strong" };
  }
  return { score: 2, label: "Good" };
}

export function validatePasswordStrength(password: string): string | undefined {
  for (const requirement of PASSWORD_REQUIREMENTS) {
    if (!requirement.test(password)) {
      return `Password must meet all requirements (${requirement.label.toLowerCase()}).`;
    }
  }
  return undefined;
}

export function passwordRequirementsMet(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((req) => req.test(password));
}
