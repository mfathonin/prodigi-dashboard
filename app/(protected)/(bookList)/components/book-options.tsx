"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItems } from "@/components/ui/menu-items";
import { cn } from "@/lib/utils";
import { BooksContentsCount } from "@/models";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { useDialog } from "../dialog/provider";

export const BookOptions = ({ book }: { book: BooksContentsCount }) => {
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
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <i className="bx bx-dots-horizontal-rounded text-lg text-slate-900 dark:text-slate-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-11">
        <MenuItems icon="bx bx-edit" label="Ubah buku" />
        <MenuItems
          onClick={() => {
            if (dialog) {
              dialog.openDialog("alert", book, async (result) => {
                if (typeof result === "boolean" && result) {
                  const supabase = (
                    await import("@/lib/supaclient/client")
                  ).createClient();

                  await supabase.from("books").delete().match({ id: book.id });

                  router.refresh();

                  if (path.includes(book.uuid!)) {
                    router.replace("/");
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
