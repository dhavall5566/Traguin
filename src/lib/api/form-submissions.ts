export type FormSubmissionInput = {
  form_type: string;
  payload: Record<string, unknown>;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  related_itinerary_id?: string | null;
  related_hotel_id?: string | null;
  related_destination_id?: string | null;
  related_package_id?: string | null;
};

export class FormSubmissionError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "FormSubmissionError";
    this.status = status;
  }
}

export function getPublicCmsBaseUrl(): string {
  const base =
    process.env.CMS_API_URL ??
    process.env.NEXT_PUBLIC_CMS_API_URL ??
    "http://127.0.0.1:8001";
  return base.replace(/\/$/, "");
}

/** Same-origin in the browser — avoids CORS preflight to the FastAPI host. */
export function getPublicFormSubmissionUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/public/form-submissions";
  }
  return `${getPublicCmsBaseUrl()}/api/cms/public/form-submissions`;
}

export type FormSubmissionResult = {
  id: string;
  lead_id?: string | null;
  customer_id?: string | null;
  lead_code?: string | null;
  member_code?: string | null;
  inquiry_code?: string | null;
};

export async function submitFormSubmission(input: FormSubmissionInput): Promise<FormSubmissionResult> {
  const url = getPublicFormSubmissionUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let detail = "Something went wrong. Please try again in a moment.";
    try {
      const body = (await response.json()) as { detail?: string };
      if (typeof body.detail === "string" && body.detail.trim()) {
        detail = body.detail;
      }
    } catch {
      // ignore parse errors
    }
    throw new FormSubmissionError(detail, response.status);
  }

  const body = (await response.json()) as FormSubmissionResult & { id: string };
  return {
    id: body.id,
    lead_id: body.lead_id ?? null,
    customer_id: body.customer_id ?? null,
    lead_code: body.lead_code ?? body.member_code ?? null,
    member_code: body.member_code ?? body.lead_code ?? null,
    inquiry_code: body.inquiry_code ?? null,
  };
}

export type OptimisticFormSubmitOptions = {
  onSuccess: () => void;
  onError: (error: FormSubmissionError) => void;
};

/** Show success immediately; submit in the background and roll back on failure. */
export function submitFormSubmissionOptimistic(
  input: FormSubmissionInput,
  { onSuccess, onError }: OptimisticFormSubmitOptions,
): void {
  onSuccess();
  void submitFormSubmission(input).catch((error) => {
    onError(
      error instanceof FormSubmissionError
        ? error
        : new FormSubmissionError("Something went wrong. Please try again.")
    );
  });
}

/** Split a full name into first/last for CRM top-level name when only one field exists. */
export function splitFullName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { first: "Unknown", last: "Visitor" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, space), last: trimmed.slice(space + 1).trim() };
}
