import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token_hash");
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (token) {
    redirectTo.searchParams.set("token", token);
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = "/auth/code-error";
  return NextResponse.redirect(redirectTo);
}
