"use client";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { downloadQRCodes } from "@/lib/utils";
import { BooksContentsCount } from "@/models";

import { useParams } from "next/navigation";

const {
  CANVAS_QR_PREFIX_ID,
  searchParams: { CONTENT_QUERY },
} = constants;

export const Toolbar = ({ book }: { book: BooksContentsCount }) => {
  const { bookId } = useParams<{ bookId: string }>();

  const handleDownloadAllQR = () => {
    const canvases = document.querySelectorAll<HTMLCanvasElement>(
      "." + CANVAS_QR_PREFIX_ID.concat(bookId)
    );
    const QRData = Array.from(canvases).map((canvas) => ({
      canvas,
      name: canvas.getAttribute("data-name")!,
    }));
    downloadQRCodes(QRData, book.title!);
  };

  return (
    <div className="flex gap-2">
      <SearchBox searchKey={CONTENT_QUERY} placeholder="Cari konten" />
      <Button
        className="rounded-full flex gap-1 size-9 lg:size-fit"
        variant="secondary"
        disabled={book.contents! === 0}
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
