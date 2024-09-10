"use client";

import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { constants } from "@/lib/constants";
import { createClient } from "@/lib/supaclient/client";
import { BooksContentsCount, QueryOptions } from "@/models";
import { BookRepository } from "@/repositories/books";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookItem } from "./book-item";
import NoBook from "./no-book";

const {
  searchParams: { BOOK_QUERY, FILTER, SORT_BY, ORDER_BY },
} = constants;

export default function BookList() {
  const searchParams = useSearchParams();
  const { bookId } = useParams<{ bookId: string }>();

  const searchKey = searchParams.get(BOOK_QUERY);
  const filter = searchParams.get(FILTER);
  const sortBy = searchParams.get(SORT_BY);
  const orderBy = searchParams.get(ORDER_BY);

  const bookQueryOptions = useMemo(() => {
    const options: QueryOptions & { isExpired?: boolean } = {
      search: searchKey ?? undefined,
      filter: filter ? filter.split(",") : undefined,
      sortBy: sortBy || "title",
      orderBy: orderBy || "asc",
    };
    return options;
  }, [searchKey, filter, sortBy, orderBy]);

  const [books, setBooks] = useState<BooksContentsCount[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const bookRepo = new BookRepository(supabase);
    const fetchBook = () => {
      bookRepo
        .getBooks(bookQueryOptions)
        .then(setBooks)
        .finally(() => {
          setLoading(false);
        });
    };

    fetchBook();

    const booksChannel = supabase
      .channel("books-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        () => fetchBook()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(booksChannel);
    };
  }, [bookQueryOptions]);

  if (loading || !books) {
    return (
      <div className="bg-background rounded-md py-10">
        <Spinner>
          <span className="text-center text-sm text-zinc-400">
            Memuat buku...
          </span>
        </Spinner>
      </div>
    );
  }

  if (books.length === 0) {
    return <NoBook />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs">Terdapat {books.length} buku</p>

      <div className="rounded-md bg-background w-full overflow-hidden">
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
