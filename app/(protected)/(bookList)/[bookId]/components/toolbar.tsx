"use client";

import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { constants } from "@/lib/constants";
import { downloadQRCodes } from "@/lib/utils";
import { BooksContentsCount, ContentUpdateForm } from "@/models";
import { ContentsRepository } from "@/repositories/contents";
import { useParams, useRouter } from "next/navigation";
import { useDialog } from "../../dialog/provider";

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
        const supabase = (
          await import("@/lib/supaclient/client")
        ).createClient();

        // console.log("on create content link", { result });
        await new ContentsRepository(supabase).upsertContentLink(
          result as ContentUpdateForm
        );

        router.refresh();
      }
    });
  };

  return (
    <div className="flex gap-2">
      <SearchBox searchKey={CONTENT_QUERY} placeholder="Cari konten" />
      <Button
        className="rounded-full flex gap-1 size-9 lg:size-fit"
        variant="secondary"
        disabled={book.contents === 0}
        onClick={handleDownloadAllQR}
      >
        <i className="bx bx-cloud-download text-lg" />
        <span className="hidden lg:block text-sm">Unduh Semua QR</span>
      </Button>
      <Button
        className="rounded-full flex gap-1 size-9 lg:size-fit"
        variant="default"
        onClick={handleAddContent}
      >
        <i className="bx bx-plus text-lg" />
        <span className="hidden lg:block text-sm">Tambah konten</span>
      </Button>
    </div>
  );
};
