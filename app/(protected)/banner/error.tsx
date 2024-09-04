"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReset = () => {
    reset();
    router.refresh(); // This will force a refresh of the current route
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold mb-2">Terjadi kesalahan!</h2>
      <p className="text-muted-foreground font-thin mb-10">{error.message}</p>
      <Button onClick={handleReset} variant="outline" className="rounded-full">
        Coba lagi
      </Button>
    </div>
  );
}
