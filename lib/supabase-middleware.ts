import { NextResponse, type NextRequest } from "next/server";

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("app_session")?.value;
  return Boolean(token);
}

export async function updateSession(request: NextRequest) {
  const publicPaths = [
    "/auth",
    "/links",
    "/quiz",
    "/api",
    "/.well-known",
  ];

  const currentPath = request.nextUrl.pathname;
  const isPublicPath = publicPaths.some(
    (path) => currentPath.startsWith(path) || currentPath === path
  );

  const authed = await isAuthenticated(request);
  if (!authed && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
