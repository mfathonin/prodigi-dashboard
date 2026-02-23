import { notFound } from "next/navigation";

import { constants } from "@/lib/constants";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";

import { AttributesRepository } from "@/repositories/attributes";
import { AttributesList } from "./components/attribute-list";
import { ContentCard } from "./components/content-card";
import { NoContent } from "./components/no-content";
import { NoMatchSearch } from "./components/no-match-search";
import { Toolbar } from "./components/toolbar";
import { DialogProvider } from "./dialog/provider";

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
  const isBooksLanding = bookId === "books";
  const isValidBookId = !!bookId && uuid.pattern.test(bookId);

  if (!isValidBookId && !isBooksLanding) return notFound();

  if (isBooksLanding) {
    return (
      <DialogProvider>
        <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
          <h4 className="h4 font-semibold">Pilih buku dari daftar</h4>
          <p className="text-sm opacity-70">
            Atau tambahkan buku baru untuk mulai mengelola konten digital.
          </p>
        </div>
      </DialogProvider>
    );
  }

  const bookRepo = new BookRepository(null);
  const contentRepo = new ContentsRepository(null);
  const attributeRepo = new AttributesRepository(null);

  const [book, contents, attributes] = await Promise.all([
    bookRepo.getBook(bookId),
    contentRepo.getBookContents(bookId),
    attributeRepo.getBookAttributes(bookId),
  ]);

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
      <AttributesList attributes={attributes} />
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
