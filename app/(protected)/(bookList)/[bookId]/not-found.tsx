import Image from "next/image";

const NoBookSelected = () => {
  return (
    <div className="rounded-lg p-4 h-full bg-surface-50-900-token flex-1 flex flex-col items-center justify-center my-auto gap-6">
      <div className="w-[180px] h-[100px] relative">
        <Image
          src="/assets/svg/no-search-result.svg"
          alt="no selected book"
          fill
        />
      </div>
      <div className="space-2 text-center max-w-[249px]">
        <p className="font-medium text-lg">Buku tidak ditemukan</p>
        <p className="text-xs text-slate-800 dark:text-slate-100">
          Pilih buku yang ada untuk dikelola. Atau buat buku baru
        </p>
      </div>
    </div>
  );
};

export default NoBookSelected;
