import Image from "next/image";
import { DownloadButton } from "./download-button";

export const DownloadPage = ({ message }: { message?: string }) => {
  return (
    <div className="py-20 container max-w-sm h-svh gap-10 flex flex-col justify-center items-center">
      <Image
        src={"/logo.png"}
        alt="Prodigi Logo"
        width={100}
        height={100}
      />
      {message && (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {message}
        </p>
      )}
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-lg">Unduh Aplikasi Prodigi</h1>
        <p className="text-sm italic text-center">
          Unduh aplikasi Progidi untuk membuka konten digital yang tercantum dalam buku
        </p>
      </div>

      <DownloadButton />
    </div>
  );
};
