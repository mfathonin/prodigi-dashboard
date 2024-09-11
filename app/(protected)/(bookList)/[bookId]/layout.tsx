import { createClient } from "@/lib/supaclient/server";
import { BookRepository } from "@/repositories/books";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AttributesList, AttributesLoading } from "./components/attribute-list";
import { Toolbar } from "./components/toolbar";

export default async function BookDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { bookId: string };
}) {
  const { bookId } = params;
  const supabase = createClient();
  const booksRepo = new BookRepository(supabase);

  if (bookId == null || bookId === "") return children;

  let book = await booksRepo.getBook(bookId).catch((error) => {
    console.error("[bookId]", "[Layout error]", error);
    return notFound();
  });

  return (
    <>
      <div className="space-y-1">
        <p className="text-secondary-700-200-token opacity-70 text-xs">
          Detail Koleksi
        </p>
        <h4 className="h4 font-semibold">{book.title}</h4>
      </div>
      <Suspense fallback={<AttributesLoading />}>
        <AttributesList bookId={book.uuid} />
      </Suspense>
      {/* Toolbar: Search | Downloads All QR | Add */}
      <Toolbar book={book} />
      <hr className="border-zinc-200 dark:border-zinc-700 mt-1" />
      {children}
    </>
  );
}
