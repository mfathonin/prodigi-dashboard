import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { withTransaction } from "@/lib/db/utils";
import { BookRepository } from "@/repositories/books";

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
    const updated = await withTransaction(async (db) => {
      const now = new Date().toISOString();
      const existing = await db.queryOne<{ uuid: string }>(
        `select uuid from books where uuid = ?`,
        [params.uuid]
      );

      if (existing) {
        await db.execute(
          `update books set title = ?, updated_at = ? where uuid = ?`,
          [title, now, params.uuid]
        );
      } else {
        await db.execute(
          `insert into books (uuid, title, firestore_id, created_at, updated_at) values (?, ?, ?, ?, ?)`,
          [params.uuid, title, null, now, now]
        );
      }

      for (const attributeId of attributes) {
        await db.execute(
          `insert or ignore into books_attributes (book_id, attribute_id) values (?, ?)`,
          [params.uuid, attributeId]
        );
      }

      if (deleted.length > 0) {
        await db.execute(
          `delete from books_attributes
           where book_id = ? and attribute_id in (${deleted.map(() => "?").join(",")})`,
          [params.uuid, ...deleted]
        );
      }

      return db.queryOne<{
        id: number;
        uuid: string;
        title: string;
        firestore_id: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
      }>(
        `select id, uuid, title, firestore_id, created_at, updated_at, deleted_at from books where uuid = ?`,
        [params.uuid]
      );
    });

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
