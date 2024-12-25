import { notFound } from "next/navigation";
import { Suspense } from "react";

import { constants } from "@/lib/constants";
import { createClient } from "@/lib/supaclient/server";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";

import { AttributesList, AttributesLoading } from "./components/attribute-list";
import { ContentCard } from "./components/content-card";
import { Toolbar } from "./components/toolbar";
import { DialogProvider } from "./dialog/provider";
import { NoContent } from "./components/no-content";
import { NoMatchSearch } from "./components/no-match-search";

const {
  validation: { uuid },
} = constants;

export default async function BookContentPage({
  params,
  searchParams,
}: {
  params: { bookId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const bookId = params.bookId;
  const isValidBookId = !!bookId && uuid.pattern.test(bookId);

  if (!isValidBookId) return notFound();

  const supabase = createClient();
  const bookRepo = new BookRepository(supabase);
  const contentRepo = new ContentsRepository(supabase);
  const book = await bookRepo.getBook(bookId);
  const contents = await contentRepo.getBookContents(bookId);

  if (!book) return notFound();

  const searchQuery = searchParams["content"] as string;
  const filteredContents = contents.filter((c) =>
    c.title?.toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );
  return (
    <DialogProvider>
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
      <div className="space-y-3 !mt-8">
        {contents.length === 0 && <NoContent />}
        {contents.length > 0 && filteredContents.length === 0 && (
          <NoMatchSearch searchParams={searchParams} />
        )}
        {filteredContents.map((contentData) => (
          <ContentCard key={contentData.id} book={book} content={contentData} />
        ))}
      </div>
    </DialogProvider>
  );
}
