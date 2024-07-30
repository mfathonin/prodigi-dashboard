import { createClient } from "@/lib/supaclient/server";

import { notFound } from "next/navigation";

import { ContentCard } from "./components/content-card";
import { NoContent } from "./components/no-content";
import { NoMatchSearch } from "./components/no-match-search";

export default async function BookDetails({
  params,
  searchParams,
}: {
  params: { bookId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { bookId } = params;

  const supabase = createClient();
  const { data, error: errorFetchBooks } = await supabase
    .from("books")
    .select("*")
    .eq("uuid", bookId)
    .limit(1);
  const { data: contents, error: errorFetchContent } = await supabase
    .from("contents_link")
    .select("*")
    .eq("book_id", bookId);

  if (errorFetchBooks || errorFetchContent) return notFound();

  const book = data[0];
  const serachQuery = searchParams["content"] as string;
  const filteredContents = contents.filter(
    (c) =>
      c.title &&
      c.title.toLowerCase().includes((serachQuery ?? "").toLowerCase())
  );

  if (contents.length === 0) return <NoContent />;
  if (filteredContents.length === 0) return <NoMatchSearch />;

  return (
    <div className="space-y-3 !mt-8">
      {filteredContents.map((contentData) => (
        <ContentCard key={contentData.id} book={book} content={contentData} />
      ))}
    </div>
  );
}
