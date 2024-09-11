import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <>
      <h1 className="text-red-400 font-semibold">Akses Ditolak</h1>
      <p className="text-sm font-thin">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Button asChild size="sm" className="mt-8 !z-50">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </>
  );
}
