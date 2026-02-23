import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { contentSchema } from "@/models/contents";
import { ContentsRepository } from "@/repositories/contents";

export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof rawBody !== "object" || rawBody === null) {
    return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
  }

  const parsed = contentSchema.safeParse({
    ...(rawBody as Record<string, unknown>),
    uuid: params.uuid,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
  }

  try {
    const repo = new ContentsRepository(null);
    const data = await repo.upsertContentLink(parsed.data as any);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/contents/[uuid].PUT] failed:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { uuid: string } }
) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repo = new ContentsRepository(null);
    await repo.deleteContentsLink(params.uuid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contents/[uuid].DELETE] failed:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
