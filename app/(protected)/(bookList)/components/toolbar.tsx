"use client";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { Books, BookUpdateForm } from "@/models";
import { AttributesRepository } from "@/repositories/attributes";
import { BookRepository } from "@/repositories/books";
import { useRouter } from "next/navigation";
import { useDialog } from "../dialog/provider";

const {
  searchParams: { BOOK_QUERY },
  EMPTY_BOOK_TEMPLATE,
} = constants;

export const Toolbar = () => {
  const dialog = useDialog();
  const router = useRouter();

  return (
    <div className="flex gap-2 mb-6">
      <SearchBox searchKey={BOOK_QUERY} placeholder="Cari buku" />
      <Button
        variant="outline"
        size="icon"
        className="rounded-full flex-shrink-0"
      >
        <i className="bx bx-filter-alt text-sm md:text-lg text-primary-500-400-token" />
      </Button>
      <Button
        size="icon"
        className="rounded-full flex-shrink-0"
        onClick={() => {
          dialog &&
            dialog.openDialog("form", EMPTY_BOOK_TEMPLATE, async (result) => {
              if (result) {
                const supabase = (
                  await import("@/lib/supaclient/client")
                ).createClient();

                const { attributes, deleted_attributes, ...bookData } =
                  result as BookUpdateForm;

                const newBook = await new BookRepository(supabase).upsertBook({
                  title: bookData.title,
                } as Books);

                if (
                  attributes &&
                  Array.isArray(attributes) &&
                  attributes.length > 0
                )
                  await new AttributesRepository(supabase).addBookAttributes(
                    newBook.uuid,
                    attributes
                  );

                router.refresh();
              }
            });
        }}
      >
        <i className="bx bx-plus text-sm md:text-lg" />
      </Button>
    </div>
  );
};
