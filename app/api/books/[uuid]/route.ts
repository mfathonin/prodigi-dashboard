import { NextResponse } from "next/server";
import { BookRepository } from "@/repositories/books";
import { AttributesRepository } from "@/repositories/attributes";

export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const body = await request.json();
  const title = String(body?.title || "").trim();
  const attributes = Array.isArray(body?.attributes) ? body.attributes : [];
  const deleted = Array.isArray(body?.deleted_attributes)
    ? body.deleted_attributes
    : [];

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const bookRepo = new BookRepository(null);
  const attrRepo = new AttributesRepository(null);

  const updated = await bookRepo.upsertBook({ uuid: params.uuid, title } as any);
  if (attributes.length > 0) await attrRepo.addBookAttributes(params.uuid, attributes);
  if (deleted.length > 0) await attrRepo.removeBookAttributes(params.uuid, deleted);

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { uuid: string } }
) {
  const bookRepo = new BookRepository(null);
  await bookRepo.deleteBook(params.uuid);
  return NextResponse.json({ ok: true });
}
