"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const DownloadButton = () => {
  return (
    <Button
      onClick={() => {
        window.open(process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL, "_blank");
      }}
    >
      <i className="bx bxl-play-store text-xl" />
      <Separator
        orientation="vertical"
        className="ms-2 me-2.5 bg-zinc-800/40 dark:bg-zinc-300/40"
      />
      Unduh
    </Button>
  );
};
