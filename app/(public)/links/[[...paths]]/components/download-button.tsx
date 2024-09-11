"use client";

import { Button } from "@/components/ui/button";

export const DownloadButton = () => {

  return (
    <Button
      className="rounded-full"
      onClick={() => {
        window.open(
          process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL,
          "_blank"
        );
      }}
    >
      Unduh
    </Button>
  );
};
