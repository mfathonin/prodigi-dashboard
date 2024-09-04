"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supaclient/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const BannerDetail = ({
  data,
}: {
  data: { uuid: string; image: string; url: string };
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      // Extract filename from the image URL
      const urlParts = data.image.split("/");
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("banner")
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("banner")
        .delete()
        .match({ uuid: data.uuid });

      if (dbError) throw dbError;

      // Refresh the page
      router.refresh();

      toast.success("Banner Dihapus", {
        description: "Banner berhasil dihapus",
      });
    } catch (error: any) {
      console.error("Error deleting banner:", error);
      toast.error("Gagal menghapus banner", {
        description: `error: ${error.message}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 py-4 px-3 bg-gradient-to-t from-zinc-700 to-transparent w-full h-2/3 flex items-end">
      <div className="flex items-center justify-between w-full gap-x-6">
        <Link
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white flex items-center group/link overflow-hidden"
        >
          <span className="group-hover/link:underline truncate">
            {data.url}
          </span>
          <i className="bx bx-link-external ml-1 flex-shrink-0"></i>
        </Link>

        <Button
          className="rounded-full flex-shrink-0"
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <i className="bx bx-trash text-lg me-2" />
          {isDeleting ? "Menghapus..." : "Hapus"}
        </Button>
      </div>
    </div>
  );
};
