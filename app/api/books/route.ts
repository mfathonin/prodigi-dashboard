import { NextResponse } from "next/server";
import { BookRepository } from "@/repositories/books";
import { AttributesRepository } from "@/repositories/attributes";

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body?.title || "").trim();
  const attributes = Array.isArray(body?.attributes) ? body.attributes : [];

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const bookRepo = new BookRepository(null);
  const attrRepo = new AttributesRepository(null);

  const newBook = await bookRepo.upsertBook({ title } as any);
  if (attributes.length > 0) {
    await attrRepo.addBookAttributes(newBook.uuid, attributes);
  }

  return NextResponse.json(newBook);
}
