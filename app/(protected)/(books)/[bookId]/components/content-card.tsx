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
import {
  BookContentsLink,
  Books,
  ContentsLink,
  ContentUpdateForm,
  ExternalContentUpdateForm,
} from "@/models";
import { useRouter } from "next/navigation";
import { toCanvas } from "qrcode";
import { useEffect, useRef } from "react";
import { useDialog } from "../dialog/provider";
import { Badge } from "@/components/ui/badge";

const {
  CANVAS_QR_PREFIX_ID,
  CONTENT: { LABEL },
} = constants;

export const ContentCard = ({
  book,
  content,
}: {
  book: Books;
  content: BookContentsLink;
}) => {
  const router = useRouter();
  const dialog = useDialog();
  const qrCanvas = useRef<HTMLCanvasElement>(null);

  const link = content.link as ContentsLink;

  if (!link) throw new Error("Link is not defined");

  useEffect(() => {
    if (qrCanvas.current != null && link.path) {
      const generatedUrl = getLinks(link.path);
      toCanvas(qrCanvas.current, generatedUrl, { width: 160, margin: 2 });
    }
  }, [qrCanvas, link.path]);

  const handleDownloadQRCode = () => {
    if (qrCanvas.current)
      downloadQRCodes({
        canvas: qrCanvas.current,
        name: content.title!,
      });
  };

  const handleDeleteContent = () => {
    const _content: ContentUpdateForm = {
      bookId: book.uuid,
      title: content.title,
      targetUrl: link.targetUrl,
      path: link.path,
      linkId: link.id,
      id: content.id,
      uuid: content.uuid,
      type: content.type ?? "content",
    };

    dialog?.openDialog("alert", _content, async (result) => {
      if (typeof result === "boolean" && result) {
        await fetch(`/api/contents/${content.uuid}`, { method: "DELETE" });

        router.refresh();
      }
    });
  };

  const handleUpdateContent = () => {
    const _content: ContentUpdateForm = {
      bookId: book.uuid,
      title: content.title,
      targetUrl: link.targetUrl,
      path: link.path,
      linkId: link.id,
      id: content.id,
      uuid: content.uuid,
      type: content.type ?? "content",
    };

    dialog?.openDialog<ContentUpdateForm>("form", _content, async (result) => {
      if (result) {
        await fetch(`/api/contents/${content.uuid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result as ExternalContentUpdateForm),
        });

        router.refresh();
      }
    });
  };

  const handleContentClick = () => {
    switch (content.type) {
      case "answer_sheet":
      case "exercise":
        if (link.targetUrl) {
          let normalized = link.targetUrl;
          if (normalized.startsWith("undefined/")) {
            normalized = `/${normalized.replace(/^undefined\//, "")}`;
          }
          normalized = normalized.replace("/quize/", "/quiz/");

          const targetUrl = normalized.startsWith("http")
            ? new URL(normalized)
            : new URL(normalized, window.location.origin);

          window.open(targetUrl.pathname, "_blank");
        }
        break;
      case "content":
        handleUpdateContent();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div
        role="button"
        className="flex gap-10 items-start md:items-center justify-between rounded-lg p-4 w-full border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer"
        onClick={handleContentClick}
      >
        <div className="flex flex-col w-full md:flex-row gap-x-10 gap-y-3">
          <div className="flex flex-col flex-1 gap-y-2">
            <div className="flex items-center gap-x-2">
              <Badge variant={content.type}>
                {LABEL[(content.type ?? "content") as keyof typeof LABEL]}
              </Badge>
              <p className="text-sm">{content.title}</p>
            </div>
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
            <MenuItems
              onClick={handleUpdateContent}
              icon="bx bx-edit"
              label="Edit konten"
            />
            <MenuItems
              icon="bx bx-export"
              label="Download QR Code"
              onClick={handleDownloadQRCode}
            />
            <MenuItems
              icon="bx bx-trash"
              label="Hapus konten"
              onClick={handleDeleteContent}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
