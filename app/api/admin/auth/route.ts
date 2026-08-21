import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const expectedPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!expectedPassword || !sessionToken) {
    return NextResponse.json(
      { error: "Admin belum dikonfigurasi. Set ADMIN_PASSWORD dan ADMIN_SESSION_TOKEN di .env." },
      { status: 500 },
    );
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
