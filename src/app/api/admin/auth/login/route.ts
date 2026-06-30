import { NextRequest, NextResponse } from "next/server";
import { getCmsBaseUrl } from "@/lib/api/client";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
  }

  const base = getCmsBaseUrl();
  const response = await fetch(`${base}/api/cms/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      typeof payload?.detail === "string"
        ? payload.detail
        : response.status >= 500
          ? "CMS server error. Check that the API is running and CMS_API_URL is correct."
          : "Login failed.";
    return NextResponse.json({ detail }, { status: response.status });
  }

  const accessToken = payload?.access_token;
  const expiresIn = Number(payload?.expires_in ?? 86400);
  if (!accessToken) {
    return NextResponse.json({ detail: "Login failed." }, { status: 502 });
  }

  const nextResponse = NextResponse.json({ ok: true });
  nextResponse.cookies.set(ADMIN_SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn,
  });
  return nextResponse;
}
