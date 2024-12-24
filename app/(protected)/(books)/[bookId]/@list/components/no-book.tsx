import Image from "next/image";

export default function NoBook() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 py-10 gap-4">
      <Image
        src="/assets/svg/no-documents.svg"
        alt="empty state"
        width={120}
        height={120}
      />
      <div className="flex flex-col items-center justify-center">
        <p>Belum ada buku</p>
        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          Tambahkan buku untuk mengelola konten digital
        </p>
      </div>
    </div>
  );
}
