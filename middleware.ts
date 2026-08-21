import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  const isAuthed = Boolean(expectedToken) && sessionCookie === expectedToken;

  const isDashboardPage = pathname.startsWith("/admin/dashboard");
  const isProtectedApi =
    pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth");

  if (isAuthed) return NextResponse.next();

  if (isDashboardPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};
