"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BooksContentsCount } from "@/models";
import { useParams, useRouter } from "next/navigation";

export const MiniBookSelector = ({
  books,
}: {
  books: BooksContentsCount[];
}) => {
  const router = useRouter();
  const { bookId } = useParams();

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
        {books.map((book) => (
          <SelectItem key={book.uuid} value={book.uuid!}>
            {book.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
