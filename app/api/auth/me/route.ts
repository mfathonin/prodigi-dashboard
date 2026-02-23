import { currentUserWithRoles } from "@/lib/auth/service";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUserWithRoles();
  return NextResponse.json({ user });
}
