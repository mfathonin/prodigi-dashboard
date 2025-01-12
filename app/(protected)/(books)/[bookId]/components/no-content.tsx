"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { constants } from "@/lib/constants";
import { ContentUpdateForm } from "@/models";

import { useDialog } from "../dialog/provider";
import { handleContentForm } from "./handler";
import { toast } from "sonner";

const { EMPTY_CONTENT_TEMPLATE } = constants;

export const NoContent = () => {
  const dialog = useDialog();
  const router = useRouter();
  const { bookId } = useParams<{ bookId: string }>();

  const handleAddContent = () => {
    const _content = {
      ...EMPTY_CONTENT_TEMPLATE,
      bookId,
    };

    dialog?.openDialog<ContentUpdateForm>("form", _content, async (result) => {
      if (result) {
        try {
          await handleContentForm(result as ContentUpdateForm);
          router.refresh();
          toast.success("Konten berhasil ditambahkan", {
            description: "Konten digital berhasil ditambahkan ke koleksi",
          });
        } catch (error) {
          console.log("Error adding content", error);
          toast.error("Gagal menambahkan konten", {
            description: "Terjadi kesalahan saat menambahkan konten",
          });
        }
      }
    });
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="rounded-lg p-4 bg-surface-50-900-token flex-1 flex flex-col items-center justify-center my-auto gap-6">
        <div className="w-[160px] h-[100px] relative">
          <Image
            src="/assets/svg/no-documents.svg"
            alt="no book contents"
            fill
          />
        </div>
        <div className="space-2 text-center max-w-xs">
          <p className="font-medium">Belum terdapat konten</p>
          <p className="text-xs text-zinc-700 dark:text-zinc-200 opacity-60">
            Tambahkan konten digital untuk koleksi anda
          </p>
        </div>
        <Button
          className="btn variant-filled-primary cursor-pointer text-sm rounded-full"
          onClick={handleAddContent}
        >
          <i className="bx bx-plus mr-2" />
          Tambah konten
        </Button>
      </div>
    </div>
  );
};
