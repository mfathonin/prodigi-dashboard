import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BooksContentsCount } from "@/models";
import Link from "next/link";
import { BookOptions } from "./book-options";
import { ReadonlyURLSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type BookItemProps = {
  book: BooksContentsCount;
  selected: boolean;
  searchParams?: ReadonlyURLSearchParams;
};

export const BookItem = ({ book, selected, searchParams }: BookItemProps) => {
  let url: string = `/${book.uuid}`;
  if (searchParams) {
    url += `?${searchParams.toString()}`;
  }

  return (
    <Link
      href={url}
      className={cn(
        "flex items-center group justify-between px-4 py-3 border-b last:border-0 border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-100 dark:hover:bg-slate-900",
        selected
          ? "bg-zinc-200 dark:bg-slate-700 dark:hover:bg-slate-800 font-bold"
          : ""
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm text-slate-900 dark:text-slate-100 line-clamp-1 text-ellipsis text-start">
                {book.title}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{book.title}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-opacity-60 font-light">
            {book.contents} konten digital
          </p>
        </div>
      </div>
      <BookOptions book={book} />
    </Link>
  );
};
