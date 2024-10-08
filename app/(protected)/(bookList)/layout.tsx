import BookList from "./components/book-list";
import { MiniBookSelector } from "./components/mini-book-selector";
import { Toolbar } from "./components/toolbar";
import { DialogProvider } from "./dialog/provider";

type BookListPageProps = {
  children: React.ReactNode;
};

const BookListLayout = async ({ children }: BookListPageProps) => {
  return (
    <DialogProvider>
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
          <div className="hidden h-fit sticky top-20 md:flex md:w-5/12 lg:w-4/12 pt-6 pb-5 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex-col">
            <div className="flex flex-col">
              <h2 className="text-xl mb-2 text-slate-900 dark:text-slate-100">
                Daftar Buku
              </h2>
              <p className="text-sm text-zinc-700 dark:text-zinc-200 opacity-70 mb-3">
                Kelola konten digital untuk koleksi anda dengan mudah
              </p>
              <Toolbar />

              <BookList />
            </div>
          </div>

          {/* Mini book selector */}
          <div className="w-full flex flex-col gap-y-2 md:hidden sticky top-[68px] z-[1] bg-background">
            <h2>Pilih buku</h2>
            <MiniBookSelector />
          </div>

          {/* Book details and digital content list */}
          <div className="w-full flex-grow flex flex-col space-y-3 min-h-[65dvh] flex-shrink-0 md:w-7/12 lg:w-8/12 py-5 px-4 border rounded-lg border-slate-200 dark:border-slate-700">
            {children}
          </div>
        </div>
      </div>
    </DialogProvider>
  );
};

export default BookListLayout;
