import { constants } from "@/lib/constants";

import { notFound } from "next/navigation";

import { ContentCard } from "./components/content-card";
import { NoContent } from "./components/no-content";
import { NoMatchSearch } from "./components/no-match-search";

const { books, contents: dummyContents } = constants;

export default async function BookDetails({
  params,
  searchParams,
}: {
  params: { bookId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { bookId } = params;
  const book = books.find((b) => b.id === bookId);

  if (!book) return notFound();

  const contents = parseInt(book.id ?? "1") % 2 === 0 ? dummyContents : [];

  const serachQuery = searchParams["content"] as string;
  const filteredContents = contents.filter((c) =>
    c.title.toLowerCase().includes((serachQuery ?? "").toLowerCase())
  );

  if (contents.length === 0) return <NoContent />;
  if (filteredContents.length === 0) return <NoMatchSearch />;

  return (
    <div className="space-y-3 !mt-8">
      {filteredContents.map((contentData) => (
        <ContentCard key={contentData.id} content={contentData} />
      ))}
    </div>
  );
}
