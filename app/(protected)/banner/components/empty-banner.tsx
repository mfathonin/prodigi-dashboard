"use client";

import { Button } from "@/components/ui/button";
import { useBannerDialog } from "../dialog-context";

export function EmptyBanner() {
  const { setOpen } = useBannerDialog();

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <h2 className="text-xl mb-2">Belum Ada Banner</h2>
      <p className="text-muted-foreground mb-10 font-thin">
        Sepertinya Anda belum menambahkan banner promosi apapun.
      </p>
      <Button className="rounded-full" onClick={() => setOpen(true)}>
        <i className="bx bx-plus text-lg mr-2" />
        Tambah Banner
      </Button>
    </div>
  );
}
