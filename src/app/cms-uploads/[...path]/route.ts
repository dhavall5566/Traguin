import { NextRequest, NextResponse } from "next/server";
import { getCmsBaseUrl } from "@/lib/api/client";

type RouteContext = { params: Promise<{ path: string[] }> };

const PRODUCTION_API = "https://api.traguin.in";
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function uploadsUrl(base: string, path: string[]): string {
  const suffix = path.map(encodeURIComponent).join("/");
  return `${base.replace(/\/$/, "")}/uploads/${suffix}`;
}

function isSafeUploadPath(path: string[]): boolean {
  return path.length > 0 && path.every((segment) => SAFE_SEGMENT.test(segment));
}

async function fetchUpload(url: string): Promise<Response | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/") && !contentType.startsWith("application/octet-stream")) {
      return null;
    }
    return response;
  } catch {
    return null;
  }
}

function asImageResponse(response: Response): NextResponse {
  const headers = new Headers();
  headers.set("Content-Type", response.headers.get("content-type") ?? "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return new NextResponse(response.body, { status: 200, headers });
}

async function proxyUpload(_request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  if (!isSafeUploadPath(path)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const local = await fetchUpload(uploadsUrl(getCmsBaseUrl(), path));
  if (local) return asImageResponse(local);

  const remote = await fetchUpload(uploadsUrl(PRODUCTION_API, path));
  if (remote) return asImageResponse(remote);

  return new NextResponse("Not found", { status: 404 });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyUpload(request, context);
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxyUpload(request, context);
}
