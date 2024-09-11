"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorElement({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const route = useRouter();

  return (
    <div className="p-4 flex flex-col w-full h-full items-center justify-center bg-red-300 dark:bg-red-900 bg-opacity-60 rounded-lg">
      <p className="text-lg">500: Terjadi Kesalahan Server</p>
      <p className="text-xs">Code: {error.digest}</p>
      <Button
        className="mt-5"
        onClick={async () => {
          route.replace("/");
        }}
      >
        <i className="bx bx-left-arrow-alt mr-2" />
        Kembali
      </Button>
    </div>
  );
}
