"use client";

import { constants } from "@/lib/constants";

import { useSearchParams } from "next/navigation";

import { BookItem } from "./book-item";
import NoBook from "./no-book";

const {
  books: dataDummy,
  searchParams: { BOOK_QUERY },
} = constants;

export default function BookList() {
  const searchParams = useSearchParams();
  const searchKey = searchParams.get(BOOK_QUERY) ?? "";

  const books: typeof dataDummy = dataDummy.filter((book) =>
    book.title.toLowerCase().includes(searchKey.toLowerCase())
  );

  if (books.length === 0) {
    return <NoBook />;
  }

  return (
    <div className="rounded-md bg-background w-full overflow-hidden">
      <div className="max-h-[calc(70dvh-148px)] overflow-y-auto">
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
