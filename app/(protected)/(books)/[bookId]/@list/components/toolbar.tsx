"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { Books, BookUpdateForm, FilterSort } from "@/models";

import { useDialog } from "../../dialog/provider";

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

  const onFilterClick = () => {
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
          className="flex-shrink-0 gap-1 size-9"
          onClick={onFilterClick}
        >
          <i className="bx bx-filter-alt text-sm md:text-lg text-primary-500-400-token" />
        </Button>
        {isFilterSortActive && (
          <div className="size-3 bg-indigo-500/90 dark:bg-indigo-400 rounded-full absolute top-0 right-0" />
        )}
      </div>
      <Button
        size="icon"
        className="flex-shrink-0 gap-1 size-9"
        onClick={() => {
          dialog &&
            dialog.openDialog("form", EMPTY_BOOK_TEMPLATE, async (result) => {
              if (result) {
                const { attributes, deleted_attributes, ...bookData } =
                  result as BookUpdateForm;

                await fetch("/api/books", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: bookData.title,
                    attributes: attributes ?? [],
                  }),
                });

                router.refresh();

                toast("Berhasil Menambahkan Buku 🎉", {
                  description: `Buku "${bookData.title}" berhasil ditambahkan!`,
                });
              }
            });
        }}
      >
        <i className="bx bx-plus text-sm md:text-lg" />
      </Button>
    </div>
  );
};
