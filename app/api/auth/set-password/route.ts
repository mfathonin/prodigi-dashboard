import { consumeInviteToken } from "@/lib/auth/service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const token = body?.token as string;
  const password = body?.password as string;

  if (!token || !password) {
    return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
  }

  try {
    await consumeInviteToken(token, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid token" },
      { status: 400 }
    );
  }
}
