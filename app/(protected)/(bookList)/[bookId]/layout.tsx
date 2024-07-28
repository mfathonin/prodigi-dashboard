import { constants } from "@/lib/constants";

import { Suspense } from "react";

import { AttributesList, AttributesLoading } from "./components/attribute-list";
import { Toolbar } from "./components/toolbar";

export default async function BookDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { bookId: string };
}) {
  const { bookId } = params;
  const book = constants.books.find((b) => b.id === bookId);

  if (!book) {
    return children;
  }

  return (
    <>
      <div className="space-y-1">
        <p className="text-secondary-700-200-token opacity-70 text-xs">
          Detail Koleksi
        </p>
        <h4 className="h4 font-semibold">{book?.title ?? "Book Title"}</h4>
      </div>
      <Suspense fallback={<AttributesLoading />}>
        <AttributesList bookId={book?.id ?? "1"} />
      </Suspense>
      {/* Toolbar: Search | Downloads All QR | Add */}
      <Toolbar />
      <hr className="border-zinc-200 dark:border-zinc-700 mt-1" />
      {children}
    </>
  );
}
