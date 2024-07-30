"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItems } from "@/components/ui/menu-items";
import { constants } from "@/lib/constants";
import { downloadQRCodes, getLinks } from "@/lib/utils";
import { BookContentsLink, Books, ContentsLink } from "@/models";

import { toCanvas } from "qrcode";
import { useEffect, useRef } from "react";

const { CANVAS_QR_PREFIX_ID } = constants;

export const ContentCard = ({
  book,
  content,
}: {
  book: Books;
  content: BookContentsLink;
}) => {
  const qrCanvas = useRef<HTMLCanvasElement>(null);

  const link = content.link as ContentsLink;

  useEffect(() => {
    if (qrCanvas.current != null && link.path) {
      const generatedUrl = getLinks(link.path);
      toCanvas(qrCanvas.current, generatedUrl, { width: 160, margin: 2 });
    }
  }, [qrCanvas, link.path]);

  return (
    <>
      <div
        role="button"
        className="flex gap-10 items-start md:items-center justify-between rounded-lg p-4 w-full border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer"
        onClick={() => {
          /* openContentDetail(content.id) */
        }}
      >
        <div className="flex flex-col w-full md:flex-row gap-x-10 gap-y-3">
          <div className="flex-1">
            <p className="text-sm">{content.title}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1">
              {link.targetUrl}
            </p>
            <div className="hidden">
              <canvas
                data-name={book.title + "-" + content.title}
                id={CANVAS_QR_PREFIX_ID.concat(book.uuid, content.uuid!)}
                ref={qrCanvas}
                className={CANVAS_QR_PREFIX_ID.concat(book.uuid)}
              />
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="flex-shrink-0 rounded-full"
            >
              <i className="bx bx-dots-horizontal-rounded" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-14">
            <MenuItems icon="bx bx-edit" label="Edit konten" />
            <MenuItems
              icon="bx bx-export"
              label="Download QR Code"
              onClick={() => {
                if (qrCanvas.current)
                  downloadQRCodes({
                    canvas: qrCanvas.current,
                    name: content.title!,
                  });
              }}
            />
            <MenuItems
              icon="bx bx-trash"
              label="Hapus konten"
              onClick={() => {
                // openDeleteConfirmationModal();
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
