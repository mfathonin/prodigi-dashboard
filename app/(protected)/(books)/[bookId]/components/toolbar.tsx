"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { downloadQRCodes } from "@/lib/utils";
import { BooksContentsCount, ContentUpdateForm } from "@/models";

import { useDialog } from "../dialog/provider";
import { handleContentForm } from "./handler";

const {
  CANVAS_QR_PREFIX_ID,
  EMPTY_CONTENT_TEMPLATE,
  searchParams: { CONTENT_QUERY },
} = constants;

export const Toolbar = ({ book }: { book: BooksContentsCount }) => {
  const { bookId } = useParams<{ bookId: string }>();
  const dialog = useDialog();
  const router = useRouter();

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

  const handleAddContent = () => {
    const _content: ContentUpdateForm = {
      ...EMPTY_CONTENT_TEMPLATE,
      bookId,
    };

    dialog?.openDialog<ContentUpdateForm>("form", _content, async (result) => {
      if (result) {
        await handleContentForm(result as ContentUpdateForm);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex gap-2">
      <SearchBox searchKey={CONTENT_QUERY} placeholder="Cari konten" />
      <Button
        className="rounded-full flex gap-1  size-9 lg:size-fit border text-sky-500 hover:text-sky-600 border-sky-500 hover:border-sky-600 dark:border-sky-800 hover:bg-sky-300/20 dark:hover:bg-sky-700/20"
        variant="outline"
        disabled={book.contents === 0}
        onClick={handleDownloadAllQR}
      >
        <i className="bx bx-cloud-download text-lg" />
        <span className="hidden lg:block text-sm">Unduh Semua QR</span>
      </Button>
      <Button
        className="rounded-full flex gap-1 size-9 lg:size-fit bg-sky-500 dark:bg-sky-900 hover:bg-sky-600 dark:hover:bg-sky-700 text-white dark:text-white hover:text-white"
        variant="default"
        onClick={handleAddContent}
      >
        <i className="bx bx-plus text-lg" />
        <span className="hidden lg:block text-sm">Tambah konten</span>
      </Button>
    </div>
  );
};
