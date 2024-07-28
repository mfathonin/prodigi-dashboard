"use client";

import { Button } from "@/components/ui/button";

import Image from "next/image";

export const NoContent = () => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="rounded-lg p-4 bg-surface-50-900-token flex-1 flex flex-col items-center justify-center my-auto gap-6">
        <div className="w-[160px] h-[100px] relative">
          <Image
            src="/assets/svg/no-documents.svg"
            alt="no book contents"
            fill
          />
        </div>
        <div className="space-2 text-center max-w-xs">
          <p className="font-medium">Belum terdapat konten</p>
          <p className="text-xs text-zinc-700 dark:text-zinc-200 opacity-60">
            Tambahkan konten digital untuk koleksi anda
          </p>
        </div>
        <Button
          className="btn variant-filled-primary cursor-pointer text-sm rounded-full"
          // onClick={() => {}}
        >
          <i className="bx bx-plus mr-2" />
          Tambah konten
        </Button>
      </div>
    </div>
  );
};
