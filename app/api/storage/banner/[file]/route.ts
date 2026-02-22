import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { file: string } }
) {
  const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
  const filePath = join(uploadDir, "banner", params.file);
  try {
    const data = await readFile(filePath);
    const ext = params.file.split(".").pop() || "png";
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": `image/${ext}` },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
