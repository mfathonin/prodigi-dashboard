"use client";

import Image from "next/image";

export const NoMatchSearch = () => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="rounded-lg p-4 bg-surface-50-900-token flex-1 flex flex-col items-center justify-center my-auto gap-6">
        <div className="w-[160px] h-[100px] relative">
          <Image
            src="/assets/svg/no-search-result.svg"
            alt="no book contents"
            fill
          />
        </div>
        <div className="space-2 text-center max-w-xs">
          <p className="font-medium">Konten digital yang ada cari tidak ada</p>
        </div>
      </div>
    </div>
  );
};
