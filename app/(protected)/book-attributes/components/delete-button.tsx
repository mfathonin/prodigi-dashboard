"use client";

import { Button } from "@/components/ui/button";
import { deleteAttribute } from "../actions";

export function DeleteButton({ uuid }: { uuid: string }) {
  return (
    <Button
      onClick={() => deleteAttribute(uuid)}
      variant="outline"
      className="border-red-200 hover:border-red-500 text-red-400 hover:text-red-600 dark:border-red-400 dark:text-red-500 dark:hover:border-red-600 dark:hover:text-red-800 !bg-transparent px-2 py-1"
      size="sm"
    >
      <i className="bx bx-trash text-base" />
    </Button>
  );
}
