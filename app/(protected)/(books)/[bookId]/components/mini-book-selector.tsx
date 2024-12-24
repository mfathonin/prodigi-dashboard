import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supaclient/server";
import { cn } from "@/lib/utils";
import { BookRepository } from "@/repositories/books";

export const MiniBookSelector = async ({
  params,
}: {
  params: { bookId: string };
}) => {
  const bookId = params.bookId;
  const supabase = createClient();
  const bookRepo = new BookRepository(supabase);

  const bookQueryOptions = {
    sortBy: "title",
    orderBy: "asc",
  };

  const books = await bookRepo.getBooks(bookQueryOptions);

  const selectedBookTitle = books.find((book) => book.uuid === bookId)?.title;

  const isSelected = (id: string) => id === bookId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="w-full items-start py-2 px-3 rounded-md border border-slate-200 dark:border-slate-700"
      >
        <p className="text-sm text-start w-full">
          {selectedBookTitle ?? "Pilih buku"}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[calc(100dvw-1.5rem)]"
      >
        {books.map((book) => (
          <Link
            key={book.uuid}
            href={`/${book.uuid}`}
            className="py-1.5 px-3 gap-x-2 flex flex-row justify-between items-center"
          >
            {book.uuid === bookId ? (
              <i className="bx bx-check text-lg text-green-500 dark:text-green-400" />
            ) : (
              <div />
            )}
            <span
              className={cn(
                "flex-1 text-sm",
                isSelected(book.uuid)
                  ? "text-green-500 dark:text-green-400"
                  : ""
              )}
            >
              {book.title}
            </span>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
