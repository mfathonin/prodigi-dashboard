"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { capitalize } from "@/lib/utils";
import { BookUpdateForm, ContentUpdateForm, FilterSort } from "@/models";
import { createContext, useContext, useState } from "react";
import { BookForm } from "./books-form";
import { ContentForm } from "./content-form";
import { FilterSortForm } from "./filter-sort-form";

type HanledDialogDataType = BookUpdateForm | ContentUpdateForm | FilterSort;

export type DialogAction = {
  openDialog: <TData extends HanledDialogDataType>(
    type: "alert" | "form",
    data: TData,
    onClose: (data?: TData | boolean) => void
  ) => void | Promise<void>;
};

const DialogContext = createContext<DialogAction | null>(null);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [onCloseFn, setOnCloseFn] =
    useState<(data?: HanledDialogDataType | boolean) => void>();
  const [dialogData, setDialogData] = useState<HanledDialogDataType>();
  const [dialogType, setDialogType] = useState<"alert" | "form">();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = <TData extends HanledDialogDataType>(
    type: "alert" | "form",
    data: TData,
    onClose: (data?: TData | boolean) => Promise<void> | void
  ) => {
    setDialogType(type);
    setDialogData(data);
    setOnCloseFn((_lastFn: any) => onClose);
    setIsOpen(true);
  };

  const isBooks = (data: HanledDialogDataType): data is BookUpdateForm => {
    return !Object.hasOwn(data, "bookId");
  };

  const isFilterSort = (data: HanledDialogDataType): data is FilterSort => {
    return Object.hasOwn(data, "filter");
  };

  const alertTitle =
    dialogData && dialogType === "alert" && isBooks(dialogData)
      ? "buku"
      : "konten";

  const dialogTitle =
    dialogData && dialogType === "form" && isBooks(dialogData)
      ? "buku"
      : "konten";

  const handleCloseDialog = async (result: HanledDialogDataType | boolean) => {
    setIsLoading(true);
    if (onCloseFn !== undefined) await onCloseFn(result);
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {dialogData && dialogType === "alert" && (
        <AlertDialog open={isOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus {alertTitle}?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm block w-full">
                <span>Apakah kamu yakin untuk menghapus {alertTitle} ini?</span>
                <br />
                <span className="py-1 px-2 bg-zinc-100 dark:bg-zinc-900 block w-full mt-2 rounded">
                  {capitalize(alertTitle)}:{" "}
                  <span className="font-semibold">
                    {(dialogData as ContentUpdateForm | BookUpdateForm).title}
                  </span>
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleCloseDialog(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleCloseDialog(true)}
                className={buttonVariants({
                  variant: "destructive",
                  size: "sm",
                })}
              >
                Hapus {alertTitle}
                {isLoading && (
                  <i className="bx bx-loader bx-spin ml-2 text-white" />
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {dialogData && dialogType === "form" && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-[70dvw] max-w-3xl">
            {isFilterSort(dialogData) ? (
              <DialogHeader>
                <DialogTitle>Filter dan Sortir</DialogTitle>
                <DialogDescription>
                  Atur filter dan sortir untuk menemukan buku yang kamu cari.
                </DialogDescription>
              </DialogHeader>
            ) : (
              <DialogHeader>
                <DialogTitle>{capitalize(dialogTitle)}</DialogTitle>
                <DialogDescription>
                  Tambah atau ubah {dialogTitle} kamu disini.
                </DialogDescription>
              </DialogHeader>
            )}
            {isFilterSort(dialogData) ? (
              <FilterSortForm
                value={dialogData as FilterSort}
                loadingState={isLoading}
                onClose={() => setIsOpen(false)}
                onSaved={async (data) => {
                  try {
                    await handleCloseDialog(data as FilterSort);
                  } catch (error) {
                    console.error(error);
                    throw error;
                  }
                }}
              />
            ) : isBooks(dialogData) ? (
              <BookForm
                loadingState={isLoading}
                book={{
                  title: dialogData.title ?? "",
                  uuid: dialogData.uuid ?? "",
                  id: dialogData.id ?? 0,
                }}
                onClose={() => setIsOpen(false)}
                onSaved={async (data) => {
                  try {
                    await handleCloseDialog(data as BookUpdateForm);
                  } catch (error) {
                    console.error(error);
                    throw error;
                  }
                }}
              />
            ) : (
              <ContentForm
                loadingState={isLoading}
                content={dialogData as ContentUpdateForm}
                onClose={() => setIsOpen(false)}
                onSaved={async (data) => {
                  try {
                    await handleCloseDialog(data as ContentUpdateForm);
                  } catch (error) {
                    console.error(error);
                    throw error;
                  }
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = DialogContext;
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }

  return useContext(context);
};
