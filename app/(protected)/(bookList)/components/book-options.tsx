"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItems } from "@/components/ui/menu-items";
import { createClient } from "@/lib/supaclient/client";
import { cn } from "@/lib/utils";
import { Books, BooksContentsCount, BookUpdateForm } from "@/models";
import { AttributesRepository } from "@/repositories/attributes";
import { BookRepository } from "@/repositories/books";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useDialog } from "../dialog/provider";

export const BookOptions = ({ book }: { book: BooksContentsCount }) => {
  const supabase = createClient();
  const bookRepo = new BookRepository(supabase);

  const path = usePathname();
  const router = useRouter();
  const dialog = useDialog();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenu
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            isOpen ? "opacity-100" : "opacity-0",
            "group-hover:opacity-100 rounded-full flex-shrink-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <i className="bx bx-dots-horizontal-rounded text-lg text-slate-900 dark:text-slate-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-11">
        <MenuItems
          onClick={() => {
            if (dialog) {
              const _book = {
                id: book.id,
                uuid: book.uuid,
                title: book.title,
              } as Books;

              dialog.openDialog<BookUpdateForm>(
                "form",
                _book,
                async (result) => {
                  if (result) {
                    const { attributes, deleted_attributes, ..._bookData } =
                      result as BookUpdateForm;

                    try {
                      await bookRepo.upsertBook({
                        id: _bookData.id,
                        title: _bookData.title,
                      } as Books);

                      if (attributes && attributes.length > 0) {
                        await new AttributesRepository(
                          supabase
                        ).addBookAttributes(_book.uuid, attributes);
                      }

                      if (deleted_attributes && deleted_attributes.length > 0) {
                        await new AttributesRepository(
                          supabase
                        ).removeBookAttributes(_book.uuid, deleted_attributes);
                      }

                      toast("Berhasil Menyimpan 🎉", {
                        description: `Buku "${_bookData.title}" berhasil disimpan!`,
                      });
                      router.refresh();
                    } catch (error) {
                      console.error(error);
                      toast("Gagal Menyimpan 🚨", {
                        description: `Gagal menyimpan buku "${_bookData.title}"!`,
                      });
                    }
                  }
                }
              );
            }
          }}
          icon="bx bx-edit"
          label="Ubah buku"
        />
        <MenuItems
          onClick={() => {
            if (dialog) {
              dialog.openDialog("alert", book, async (result) => {
                if (typeof result === "boolean" && result) {
                  await bookRepo.deleteBook(book.uuid);

                  router.refresh();

                  if (path.includes(book.uuid)) {
                    router.replace("/");
                    router.refresh();
                  }
                }
              });
            }
          }}
          icon="bx bx-trash"
          label="Hapus buku"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
