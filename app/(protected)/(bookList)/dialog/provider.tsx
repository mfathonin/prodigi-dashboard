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
import { capitalize } from "@/lib/utils";
import { BookContentsLink, BooksContentsCount } from "@/models";

import { createContext, useContext, useState } from "react";

type HanledDialogDataType = BooksContentsCount | BookContentsLink;

export type DialogAction = {
  openDialog: <TData extends HanledDialogDataType>(
    type: "alert" | "form",
    data: TData,
    onClose: (data?: HanledDialogDataType | boolean) => void
  ) => void;
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
    onClose: (data?: HanledDialogDataType | boolean) => void
  ) => {
    setDialogType(type);
    setDialogData(data);
    setOnCloseFn((_lastFn: any) => onClose);
    setIsOpen(true);
  };

  const isBooks = (data: HanledDialogDataType): data is BooksContentsCount => {
    return (data as BooksContentsCount).contents !== undefined;
  };

  const alertTitle =
    dialogData && dialogType === "alert" && isBooks(dialogData)
      ? "buku"
      : "konten";

  const handleCloseAlert = async (result: boolean) => {
    setIsLoading(true);
    onCloseFn && (await onCloseFn(result));
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
                    {
                      (dialogData as BookContentsLink | BooksContentsCount)
                        .title
                    }
                  </span>
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleCloseAlert(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleCloseAlert(true)}
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
