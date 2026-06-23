import { NextRequest, NextResponse } from "next/server";
import { getCmsBaseUrl } from "@/lib/api/client";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const base = getCmsBaseUrl();
  const response = await fetch(`${base}/api/cms/auth/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      { detail: typeof payload?.detail === "string" ? payload.detail : "Session expired." },
      { status: response.status },
    );
  }

  return NextResponse.json(payload);
}
