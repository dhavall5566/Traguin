import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

function isPublicAdminPath(pathname: string): boolean {
  return (
    pathname === ADMIN_LOGIN_PATH ||
    pathname.startsWith(`${ADMIN_LOGIN_PATH}/`) ||
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout"
  );
}

function requiresAuth(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/cms") ||
    pathname.startsWith("/api/admin")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!requiresAuth(pathname) || isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = ADMIN_LOGIN_PATH;
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
