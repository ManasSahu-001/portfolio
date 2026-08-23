import { NextRequest, NextResponse } from "next/server";
import {
  checkCredentials,
  createSessionToken,
  sessionCookieName,
  sessionMaxAge,
} from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (!checkCredentials(email, password)) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  const isHttps =
    process.env.NEXT_PUBLIC_APP_URL?.startsWith("https") ??
    req.nextUrl.protocol === "https:";
  res.cookies.set({
    name: sessionCookieName(),
    value: await createSessionToken(email),
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: sessionMaxAge(),
  });
  return res;
}
