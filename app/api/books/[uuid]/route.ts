import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { BookRepository } from "@/repositories/books";
import { AttributesRepository } from "@/repositories/attributes";

export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const payload = body as Record<string, unknown>;
  const title = String(payload.title || "").trim();
  const attributes = Array.isArray(payload.attributes)
    ? payload.attributes.filter((attribute): attribute is string => typeof attribute === "string")
    : [];
  const deleted = Array.isArray(payload.deleted_attributes)
    ? payload.deleted_attributes.filter((attribute): attribute is string => typeof attribute === "string")
    : [];

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  try {
    const bookRepo = new BookRepository(null);
    const attrRepo = new AttributesRepository(null);

    const updated = await bookRepo.upsertBook({ uuid: params.uuid, title } as any);
    if (attributes.length > 0) await attrRepo.addBookAttributes(params.uuid, attributes);
    if (deleted.length > 0) await attrRepo.removeBookAttributes(params.uuid, deleted);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[api/books/[uuid].PUT] failed:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
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
    const bookRepo = new BookRepository(null);
    await bookRepo.deleteBook(params.uuid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/books/[uuid].DELETE] failed:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
