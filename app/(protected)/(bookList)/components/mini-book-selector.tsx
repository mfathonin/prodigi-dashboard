"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Books, BooksContentsCount } from "@/models";

import { useParams, useRouter } from "next/navigation";

export const MiniBookSelector = ({
  books,
}: {
  books: BooksContentsCount[];
}) => {
  const router = useRouter();
  const { bookId } = useParams();

  const sortedBooks = books.sort((a, b) => {
    if (a.title! < b.title!) {
      return -1;
    }
    if (a.title! > b.title!) {
      return 1;
    }
    return 0;
  });

  return (
    <Select
      onValueChange={(id) => {
        router.push(`/${id}`);
      }}
      value={bookId as string}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih buku" />
      </SelectTrigger>
      <SelectContent>
        {sortedBooks.map((book) => (
          <SelectItem key={book.uuid} value={book.uuid!}>
            {book.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
