export default function BookListSlot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hidden h-fit sticky top-20 md:flex md:w-5/12 lg:w-4/12 pt-6 pb-5 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex-col">
      <div className="flex flex-col">
        <h2 className="text-xl mb-2 text-slate-900 dark:text-slate-100">
          Daftar Buku
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-200 opacity-70 mb-3">
          Kelola konten digital untuk koleksi anda dengan mudah
        </p>
        {children}
      </div>
    </div>
  );
}
