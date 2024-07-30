"use client";

import { constants } from "@/lib/constants";
import { BooksContentsCount } from "@/models";

import { useSearchParams } from "next/navigation";

import { BookItem } from "./book-item";
import NoBook from "./no-book";

const {
  searchParams: { BOOK_QUERY },
} = constants;

export default function BookList({ books }: { books: BooksContentsCount[] }) {
  const searchParams = useSearchParams();
  const searchKey = searchParams.get(BOOK_QUERY) ?? "";

  const filteredBooks = books.filter((book) =>
    book.title!.toLowerCase().includes(searchKey.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return <NoBook />;
  }

  return (
    <div className="rounded-md bg-background w-full overflow-hidden">
      <div className="max-h-[calc(70dvh-148px)] overflow-y-auto">
        {filteredBooks.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
