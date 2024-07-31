import { createClient } from "@/lib/supaclient/server";

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
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books_contents_view")
    .select("*")
    .eq("uuid", bookId)
    .limit(1);

  if (error || data.length === 0) {
    return children;
  }

  const book = data[0];

  return (
    <>
      <div className="space-y-1">
        <p className="text-secondary-700-200-token opacity-70 text-xs">
          Detail Koleksi
        </p>
        <h4 className="h4 font-semibold">{book.title}</h4>
      </div>
      <Suspense fallback={<AttributesLoading />}>
        <AttributesList bookId={book.uuid!} />
      </Suspense>
      {/* Toolbar: Search | Downloads All QR | Add */}
      <Toolbar book={book} />
      <hr className="border-zinc-200 dark:border-zinc-700 mt-1" />
      {children}
    </>
  );
}
