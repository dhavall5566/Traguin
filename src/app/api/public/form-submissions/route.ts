import { NextRequest, NextResponse } from "next/server";
import { getCmsBaseUrl } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const url = `${getCmsBaseUrl()}/api/cms/public/form-submissions`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": request.headers.get("content-type") ?? "application/json",
        "User-Agent": request.headers.get("user-agent") ?? "traguin-web",
        ...(request.headers.get("x-forwarded-for")
          ? { "X-Forwarded-For": request.headers.get("x-forwarded-for")! }
          : {}),
      },
      body,
      cache: "no-store",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[form-submissions] upstream fetch failed", url, error);
    }
    return NextResponse.json(
      {
        detail:
          "Could not reach the submission service. Check that the API is running locally (CMS_API_URL).",
      },
      { status: 503 },
    );
  }

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
