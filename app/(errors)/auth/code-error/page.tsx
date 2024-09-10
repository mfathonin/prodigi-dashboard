import { FullLogo } from "@/components/ui/full-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthCodeError() {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="font-extrabold text-center w-full text-red-400">
          Kesalahan Kode Otentikasi
        </h1>
        <p className="font-thin text-center w-full">
          Kode tidak valid atau kedaluwarsa.
        </p>
      </div>
      <p className="text-center text-sm max-w-md">
        Maaf, kode otentikasi yang digunakan tidak valid atau telah kedaluwarsa.
        Silakan coba lagi atau hubungi Admin untuk bantuan.
      </p>
    </>
  );
}
