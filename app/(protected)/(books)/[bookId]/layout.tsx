import { constants } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { MiniBookSelector } from "./components/mini-book-selector";

export const metadata: Metadata = {
  title: "Prodigi | Book Management",
};

type BookListPageProps = {
  children: React.ReactNode;
  list: React.ReactNode;
  params: { bookId: string };
};

const {
  validation: { uuid },
} = constants;

const BookListLayout = async ({
  children,
  list,
  params,
}: BookListPageProps) => {
  const bookId = params.bookId;
  const isValidUUID = uuid.pattern.test(bookId);

  if (!isValidUUID && bookId !== "books") return notFound();

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          Keloka Konten Digital
        </h1>
        <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
          Tempat mengelola konten digital dalam buku yang kita miliki.
        </p>
      </div>
      <div className="flex flex-col flex-grow md:flex-row gap-8 mt-10 md:mt-[52px]">
        {/* Book list and filter */}
        {list}

        {/* Mini book selector */}
        <div className="w-full flex flex-col gap-y-2 md:hidden sticky top-[68px] z-[1] bg-background">
          <h2>Pilih buku</h2>
          <MiniBookSelector params={params} />
        </div>

        {/* Book details and digital content list */}
        <div className="w-full flex-grow flex flex-col space-y-3 min-h-[65dvh] flex-shrink-0 md:w-7/12 lg:w-8/12 py-5 px-4 border rounded-lg border-slate-200 dark:border-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BookListLayout;
