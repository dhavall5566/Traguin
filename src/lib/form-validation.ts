import type { Dispatch, SetStateAction } from "react";

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[\p{L}\s'.-]+$/u;

export function collectErrors(fields: Record<string, string | undefined>): FieldErrors {
  const errors: FieldErrors = {};
  for (const [key, message] of Object.entries(fields)) {
    if (message) errors[key] = message;
  }
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function clearFieldError(
  setErrors: Dispatch<SetStateAction<FieldErrors>>,
  field: string
): void {
  setErrors((prev) => {
    if (!prev[field]) return prev;
    const { [field]: _removed, ...rest } = prev;
    return rest;
  });
}

export function validateName(value: string, required = true): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return required ? "Please enter your full name" : undefined;
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 80) return "Name must be 80 characters or fewer";
  if (!NAME_RE.test(trimmed)) return "Name can only contain letters, spaces, and hyphens";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your email address";
  if (trimmed.length > 254) return "Email address is too long";
  if (!EMAIL_RE.test(trimmed)) return "Please enter a valid email address";
  return undefined;
}

export function validatePhone(value: string, required = false): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return required ? "Please enter your phone number" : undefined;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) return "Enter a valid phone number (at least 10 digits)";
  if (digits.length > 15) return "Phone number is too long";
  return undefined;
}

export function validateMessage(value: string, minLength = 10): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter a message";
  if (trimmed.length < minLength) {
    return `Message must be at least ${minLength} characters`;
  }
  if (trimmed.length > 2000) return "Message must be 2000 characters or fewer";
  return undefined;
}

export function validateTravelers(value: string): string | undefined {
  if (!value.trim()) return "Please enter the number of travelers";
  const n = Number(value);
  if (Number.isNaN(n) || !Number.isInteger(n)) return "Please enter a whole number";
  if (n < 1) return "At least one traveler is required";
  if (n > 50) return "For groups over 50, please contact us directly";
  return undefined;
}

export function validateTravelDates(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your preferred travel dates";
  if (trimmed.length < 3) return "Please provide more detail for your travel dates";
  if (trimmed.length > 120) return "Travel dates must be 120 characters or fewer";
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Please enter your password";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (value.length > 128) return "Password must be 128 characters or fewer";
  return undefined;
}

export function validateDestination(value: string, required = true): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return required ? "Please enter a destination" : undefined;
  if (trimmed.length < 2) return "Destination must be at least 2 characters";
  if (trimmed.length > 100) return "Destination must be 100 characters or fewer";
  return undefined;
}

export function validateStartDate(value: string, minDate: string): string | undefined {
  if (!value) return "Please select a start date";
  if (value < minDate) return "Start date cannot be in the past";
  return undefined;
}

export function validateEndDate(value: string, startDate: string, minDate: string): string | undefined {
  if (!value) return "Please select an end date";
  if (!startDate) return "Please select a start date first";
  if (value < startDate) return "End date must be on or after start date";
  if (value < minDate) return "End date cannot be in the past";
  return undefined;
}

export function validateBudget(value: string): string | undefined {
  if (!value) return "Please select a budget range";
  return undefined;
}

export function validatePositiveNumber(
  value: string,
  label: string,
  options: { min?: number; max?: number; required?: boolean; integer?: boolean } = {}
): string | undefined {
  const { min = 1, max = 999999999, required = true, integer = false } = options;
  const trimmed = value.trim();
  if (!trimmed) return required ? `Please enter ${label}` : undefined;
  const n = Number(trimmed);
  if (Number.isNaN(n)) return `Please enter a valid ${label}`;
  if (options.integer && !Number.isInteger(n)) return `${label} must be a whole number`;
  if (n < min) return `${label} must be at least ${min}`;
  if (n > max) return `${label} must be ${max} or fewer`;
  return undefined;
}

export function validateService(value: string): string | undefined {
  if (!value.trim()) return "Please select a service";
  return undefined;
}

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export function validateContactForm(form: ContactFormValues): FieldErrors {
  return collectErrors({
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone, false),
    message: validateMessage(form.message),
  });
}

export type InquiryFormValues = {
  name: string;
  email: string;
  phone: string;
  travelers: string;
  dates: string;
  message: string;
};

export function validateInquiryForm(form: InquiryFormValues): FieldErrors {
  return collectErrors({
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone, true),
    dates: validateTravelDates(form.dates),
    travelers: validateTravelers(form.travelers),
    message: validateMessage(form.message),
  });
}

export type ConciergeFormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export function validateConciergeForm(form: ConciergeFormValues): FieldErrors {
  return collectErrors({
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone, true),
    service: validateService(form.service),
    message: validateMessage(form.message),
  });
}

export type LoginFormValues = {
  email: string;
  password: string;
};

export function validateLoginForm(form: LoginFormValues): FieldErrors {
  return collectErrors({
    email: validateEmail(form.email),
    password: validatePassword(form.password),
  });
}

export type AiPlannerFormValues = {
  destination: string;
  budget: string;
  duration: string;
  travelers: string;
};

export type TravelPlannerFormValues = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
  budget: string;
  notes: string;
};

export function validateTravelPlannerStep(
  step: number,
  form: TravelPlannerFormValues,
  minDate: string
): FieldErrors {
  if (step === 0) {
    return collectErrors({
      destination: validateDestination(form.destination),
      startDate: validateStartDate(form.startDate, minDate),
      endDate: validateEndDate(form.endDate, form.startDate, minDate),
    });
  }
  if (step === 1) {
    return collectErrors({
      travelers: validateTravelers(form.travelers),
      budget: validateBudget(form.budget),
    });
  }
  if (step === 2) {
    const trimmed = form.notes.trim();
    return collectErrors({
      notes: trimmed.length > 2000 ? "Notes must be 2000 characters or fewer" : undefined,
    });
  }
  return {};
}

export function validateTravelPlannerForm(
  form: TravelPlannerFormValues,
  minDate: string
): FieldErrors {
  return {
    ...validateTravelPlannerStep(0, form, minDate),
    ...validateTravelPlannerStep(1, form, minDate),
    ...validateTravelPlannerStep(2, form, minDate),
  };
}

export function validateAiPlannerForm(form: AiPlannerFormValues): FieldErrors {
  return collectErrors({
    destination: validateDestination(form.destination, false),
    budget: validatePositiveNumber(form.budget, "budget", { min: 10000, max: 50000000 }),
    duration: validatePositiveNumber(form.duration, "duration", {
      min: 1,
      max: 90,
      integer: true,
    }),
    travelers: validateTravelers(form.travelers),
  });
}
