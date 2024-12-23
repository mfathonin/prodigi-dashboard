"use client";

type QuizErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: QuizErrorProps) {
  return (
    <div className="flex w-full flex-col gap-2 p-4 py-6 rounded-lg bg-red-100 dark:bg-red-800 text-red-600 dark:text-white  border border-red-500">
      <h1 className="flex items-ceter">
        <i className="bx bx-file-find bx-sm me-2" />
        {error.message ?? "Terjadi kesalahan dalam memuat data lembar kerja"}
      </h1>
    </div>
  );
}
