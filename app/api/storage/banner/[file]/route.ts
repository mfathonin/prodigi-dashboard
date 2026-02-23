import { readFile } from "fs/promises";
import { extname, resolve, sep } from "path";
import { NextResponse } from "next/server";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: { file: string } }
) {
  const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
  const bannerDir = resolve(uploadDir, "banner");
  const resolvedFilePath = resolve(bannerDir, params.file);
  if (
    resolvedFilePath !== bannerDir &&
    !resolvedFilePath.startsWith(`${bannerDir}${sep}`)
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const data = await readFile(resolvedFilePath);
    const ext = extname(resolvedFilePath).toLowerCase();
    const contentType = MIME_BY_EXTENSION[ext] ?? "application/octet-stream";
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
