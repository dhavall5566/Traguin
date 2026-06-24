import { NextRequest, NextResponse } from "next/server";
import { getPublicCmsBaseUrl } from "@/lib/api/form-submissions";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const url = `${getPublicCmsBaseUrl()}/api/cms/public/form-submissions`;

  const response = await fetch(url, {
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

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
