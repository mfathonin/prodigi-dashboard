import { createClient } from "@/lib/supaclient/server";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";
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
  const bookRepo = new BookRepository(supabase);
  const contentRepo = new ContentsRepository(supabase);
  const book = await bookRepo.getBook(bookId);
  const contents = await contentRepo.getBookContents(bookId);

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
