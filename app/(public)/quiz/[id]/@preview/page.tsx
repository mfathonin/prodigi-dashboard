import { DownloadButton } from "@/app/(public)/links/[[...paths]]/components/download-button";

export default function PublicQuizPage() {
  return (
    <div className="[&>p]:text-sm [&>p]:dark:text-zinc-500 [&>p]:text-zinc-700 mt-20">
      <h1 className="text-lg font-semibold mb-4">Akses Terbatas ✋🏻</h1>
      <p>Halaman ini hanya bisa diakses melalui aplikasi Prodigi terbaru.</p>
      <p>
        Unduh atau perbarui Prodigi kamu di PlayStore dan akses kembali link ini
        melalui aplikasi Prodigi.
      </p>
      <div className="mt-12">
        <DownloadButton />
      </div>
    </div>
  );
}
