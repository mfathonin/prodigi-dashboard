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
    if (
      error instanceof Error &&
      ["Invalid invite token", "Invite token expired"].includes(error.message)
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message === "Session setup failed") {
      return NextResponse.json(
        { error: "Password created. Please sign in again." },
        { status: 500 }
      );
    }

    console.error("[api/auth/set-password.POST] failed:", error);
    return NextResponse.json(
      { error: "Unable to set password" },
      { status: 500 }
    );
  }
}
