import { execute } from "@/lib/db/utils";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("image") as File | null;
  const url = form.get("url") as string | null;

  if (!file || !url) {
    return NextResponse.json({ error: "Missing image or url" }, { status: 400 });
  }

  const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
  const bucketDir = join(uploadDir, "banner");
  await mkdir(bucketDir, { recursive: true });

  const fileId = randomUUID();
  const ext = extname(file.name) || ".bin";
  const filename = `${fileId}${ext}`;
  const filepath = join(bucketDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, bytes);

  const image = `/api/storage/banner/${filename}`;
  const uuid = randomUUID();

  await execute(`insert into banner (uuid, image, url) values (?, ?, ?)`, [
    uuid,
    image,
    url,
  ]);

  return NextResponse.json({ uuid, image, url });
}
