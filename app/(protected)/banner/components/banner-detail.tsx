"use client";

import { Button } from "@/components/ui/button";

export const BannerDetail = ({
  data,
}: {
  data: { image: string; url: string };
}) => {
  return (
    <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 py-4 px-3 bg-gradient-to-t from-zinc-700 to-transparent w-full h-2/3 flex items-end">
      <div className="flex items-center justify-between w-full">
        <p>{data.url}</p>

        <Button className="rounded-full" size="sm" variant="destructive">
          <i className="bx bx-trash text-lg me-2" />
          Hapus
        </Button>
      </div>
    </div>
  );
};
