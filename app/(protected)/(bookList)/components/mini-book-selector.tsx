"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supaclient/client";
import { BooksContentsCount } from "@/models";
import { BookRepository } from "@/repositories/books";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const MiniBookSelector = () => {
  const [books, setBooks] = useState<BooksContentsCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const bookRepo = new BookRepository(supabase);
    setLoading(true);
    bookRepo
      .getBooks()
      .then(setBooks)
      .finally(() => setLoading(false));
  }, []);

  const router = useRouter();
  const { bookId } = useParams();

  return (
    <Select
      onValueChange={(id) => {
        router.push(`/${id}`);
      }}
      value={loading ? "loading" : (bookId as string)}
      disabled={loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih buku" />
      </SelectTrigger>
      <SelectContent>
        {loading && (
          <SelectItem key="loading" value="loading" disabled>
            Memuat list buku...
          </SelectItem>
        )}
        {books.map((book) => (
          <SelectItem key={book.uuid} value={book.uuid!}>
            {book.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
