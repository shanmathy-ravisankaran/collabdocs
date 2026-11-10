import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/types";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const { userId } = await request.json().catch(() => ({}));
  if (!DEMO_USERS.some((user) => user.id === userId)) return NextResponse.json({ error: "Unknown demo user." }, { status: 400 });
  const response = NextResponse.json({ userId });
  response.cookies.set(SESSION_COOKIE, userId, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  return response;
}
