import { TooltipProvider } from "@/components/ui/tooltip";
import { constants } from "@/lib/constants";
import { createClient } from "@/lib/supaclient/server";
import { BookRepository } from "@/repositories/books";

import { BookItem } from "./book-item";
import NoBook from "./no-book";

const {
  searchParams: { BOOK_QUERY, FILTER, SORT_BY, ORDER_BY },
} = constants;

export default async function BookList({
  params,
  searchParams,
}: {
  params: { bookId: string };
  searchParams: Record<string, string>;
}) {
  const { bookId } = params;

  const searchKey = searchParams[BOOK_QUERY];
  const filter = searchParams[FILTER];
  const sortBy = searchParams[SORT_BY];
  const orderBy = searchParams[ORDER_BY];

  const bookQueryOptions = {
    search: searchKey ?? undefined,
    filter: filter ? filter.split(",") : undefined,
    sortBy: sortBy || "title",
    orderBy: orderBy || "asc",
  };

  const supabase = createClient();
  const bookRepo = new BookRepository(supabase);
  const books = await bookRepo.getBooks(bookQueryOptions);

  if (books.length === 0) {
    return <NoBook />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs">Terdapat {books.length} buku</p>

      <div className="rounded-md bg-background w-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <div className="max-h-[calc(70dvh-148px)] overflow-y-auto">
          <TooltipProvider>
            {books.map((book) => (
              <BookItem
                key={book.id}
                selected={bookId === book.uuid}
                book={book}
                searchParams={searchParams}
              />
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
