import { currentUserWithRoles } from "@/lib/auth/service";
import { execute, queryOne } from "@/lib/db/utils";
import { unlink } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: { uuid: string } }
) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await queryOne<{ image: string }>(
      `select image from banner where uuid = ?`,
      [params.uuid]
    );

    if (!row) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const fileName = row.image.split("/").pop();
    if (fileName) {
      const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
      const filePath = join(uploadDir, "banner", fileName);
      try {
        await unlink(filePath);
      } catch {
        // Ignore if file not found.
      }
    }

    await execute(`delete from banner where uuid = ?`, [params.uuid]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/banner/[uuid].DELETE] failed:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
