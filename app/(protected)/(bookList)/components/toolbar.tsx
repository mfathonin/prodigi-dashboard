"use client";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { Books, BookUpdateForm, FilterSort } from "@/models";
import { AttributesRepository } from "@/repositories/attributes";
import { BookRepository } from "@/repositories/books";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useDialog } from "../dialog/provider";

const {
  searchParams: { BOOK_QUERY, FILTER, SORT_BY, ORDER_BY },
  EMPTY_BOOK_TEMPLATE,
} = constants;

export const Toolbar = () => {
  const dialog = useDialog();
  const router = useRouter();
  const srcParams = useSearchParams();

  const filterInitial = useMemo(
    () => srcParams.get(FILTER)?.split(","),
    [srcParams]
  );
  const sortByInitial = srcParams.get(SORT_BY);
  const orderByInitial = srcParams.get(ORDER_BY);

  const isFilterSortActive = useMemo(
    () => filterInitial || sortByInitial !== null || orderByInitial !== null,
    [filterInitial, sortByInitial, orderByInitial]
  );

  const initialFilterSort: FilterSort = {
    filter: filterInitial ?? [],
    sort: {
      field: sortByInitial ?? "title",
      order: (orderByInitial ?? "asc") as "asc" | "desc",
    },
  };

  const onSeachClick = () => {
    dialog?.openDialog<FilterSort>(
      "form",
      initialFilterSort,
      async (result) => {
        let url = new URL(window.location.href);
        srcParams.forEach((value, key) => {
          url.searchParams.set(key, value);
        });

        const { filter, sort } = result as FilterSort;
        if (filter && Array.isArray(filter)) {
          url.searchParams.delete(FILTER);
          url.searchParams.append(FILTER, filter.join(","));
        }
        if (!filter || filter.length === 0) url.searchParams.delete(FILTER);

        if (sort && !(sort.field === "title" && sort.order === "asc")) {
          url.searchParams.set(SORT_BY, sort.field);
          url.searchParams.set(ORDER_BY, sort.order);
        } else {
          url.searchParams.delete(SORT_BY);
          url.searchParams.delete(ORDER_BY);
        }

        router.replace(url.toString());
      }
    );
  };

  return (
    <div className="flex gap-2 mb-6">
      <SearchBox searchKey={BOOK_QUERY} placeholder="Cari buku" />
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full flex-shrink-0"
          onClick={onSeachClick}
        >
          <i className="bx bx-filter-alt text-sm md:text-lg text-primary-500-400-token" />
        </Button>
        {isFilterSortActive && (
          <div className="size-3 bg-violet-400 rounded-full absolute top-0 right-0" />
        )}
      </div>
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
