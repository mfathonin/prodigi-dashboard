import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BooksContentsCount } from "@/models";
import Link from "next/link";
import { BookOptions } from "./book-options";

export type BookItemProps = {
  book: BooksContentsCount;
};

export const BookItem = ({ book }: BookItemProps) => {
  return (
    <Link
      href={`/${book.uuid}`}
      className="flex items-center group justify-between px-4 py-3 border-b last:border-0 border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {book.contents} konten digital
          </p>
        </div>
      </div>
      <BookOptions book={book} />
    </Link>
  );
};
