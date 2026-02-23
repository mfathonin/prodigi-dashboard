import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { BookRepository } from "@/repositories/books";
import { AttributesRepository } from "@/repositories/attributes";

export async function POST(request: Request) {
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

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  try {
    const bookRepo = new BookRepository(null);
    const attrRepo = new AttributesRepository(null);

    const newBook = await bookRepo.upsertBook({ title } as any);
    if (attributes.length > 0) {
      await attrRepo.addBookAttributes(newBook.uuid, attributes);
    }

    return NextResponse.json(newBook);
  } catch (error) {
    console.error("[api/books.POST] failed:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
