import { currentUserWithRoles } from "@/lib/auth/service";
import { execute } from "@/lib/db/utils";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("image") as File | null;
  const url = form.get("url");
  const normalizedUrl = typeof url === "string" ? url.trim() : null;

  if (!file || !normalizedUrl) {
    return NextResponse.json({ error: "Missing image or url" }, { status: 400 });
  }
  if (file.type === "image/svg+xml" || !ALLOWED_MIME_TO_EXT[file.type]) {
    return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
  }

  try {
    const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
    const bucketDir = join(uploadDir, "banner");
    await mkdir(bucketDir, { recursive: true });

    const fileId = randomUUID();
    const ext = ALLOWED_MIME_TO_EXT[file.type];
    const filename = `${fileId}${ext}`;
    const filepath = join(bucketDir, filename);

    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, bytes);

    const image = `/api/storage/banner/${filename}`;
    const uuid = randomUUID();

    await execute(`insert into banner (uuid, image, url) values (?, ?, ?)`, [
      uuid,
      image,
      normalizedUrl,
    ]);

    return NextResponse.json({ uuid, image, url: normalizedUrl });
  } catch (error) {
    console.error("[api/banner/upload.POST] failed:", error);
    return NextResponse.json({ error: "Failed to upload banner" }, { status: 500 });
  }
}
