"use client";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { downloadQRCodes } from "@/lib/utils";

import { useParams, useSearchParams } from "next/navigation";

const {
  CANVAS_QR_PREFIX_ID,
  searchParams: { CONTENT_QUERY },
} = constants;

export const Toolbar = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  // TODO: get real book data
  const bookId = params.bookId as string;
  const currentBook = { title: "Collection Name" + bookId, id: bookId };

  const handleDownloadAllQR = () => {
    const canvases: NodeListOf<HTMLCanvasElement> =
      document.querySelectorAll<HTMLCanvasElement>(
        "." + CANVAS_QR_PREFIX_ID.concat(currentBook.id)
      );
    const QRData = Array.from(canvases).map((canvas) => ({
      canvas,
      name: canvas.getAttribute("data-name")!,
    }));
    downloadQRCodes(QRData, currentBook.title);
  };

  return (
    <div className="flex gap-2">
      <SearchBox searchKey={CONTENT_QUERY} placeholder="Cari konten" />
      <Button
        className="rounded-full flex gap-1 size-9 lg:size-fit"
        variant="secondary"
        onClick={handleDownloadAllQR}
      >
        <i className="bx bx-cloud-download text-lg" />
        <span className="hidden lg:block text-sm">Unduh Semua QR</span>
      </Button>
      <Button
        className="rounded-full flex gap-1 size-9 lg:size-fit"
        variant="default"
      >
        <i className="bx bx-plus text-lg" />
        <span className="hidden lg:block text-sm">Tambah konten</span>
      </Button>
    </div>
  );
};
