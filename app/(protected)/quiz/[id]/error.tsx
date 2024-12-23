"use client";

import { Button } from "@/components/ui/button";

type QuizErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: QuizErrorProps) {
  return (
    <div className="flex w-full flex-col gap-4 p-4 py-6 rounded-lg bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-white border border-red-500">
      <h1 className="flex items-center">
        <i className="bx bx-file-find bx-sm me-2" />
        {error.message ?? "Terjadi kesalahan dalam memuat data lembar kerja"}
      </h1>
      <Button variant={"destructive"} onClick={reset} className="w-fit">
        Coba Lagi
      </Button>
    </div>
  );
}
