export type FormSubmissionInput = {
  form_type: string;
  payload: Record<string, unknown>;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  related_itinerary_id?: string | null;
  related_hotel_id?: string | null;
  related_destination_id?: string | null;
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
  return (process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");
}

export async function submitFormSubmission(input: FormSubmissionInput): Promise<void> {
  const url = `${getPublicCmsBaseUrl()}/api/cms/public/form-submissions`;
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
}

/** Split a full name into first/last for CRM top-level name when only one field exists. */
export function splitFullName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { first: "Unknown", last: "Visitor" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, space), last: trimmed.slice(space + 1).trim() };
}
