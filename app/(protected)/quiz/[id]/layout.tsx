import { Metadata } from "next";
import { toast } from "sonner";

import { createClient } from "@/lib/supaclient/server";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";

import NotFound from "./not-found";
import { PostgrestError } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Prodigi | Worksheet Management",
};

export default async function QuizLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const supabase = createClient();
  const contentRepo = new ContentsRepository(supabase);
  let contentLink;
  try {
    contentLink = await contentRepo.getContentLinkByTargetUrl(
      `${process.env.NEXT_PUBLIC_LINKS_APP}/quiz/${params.id}`
    );
  } catch (error) {
    console.error("[quiz.contentLink.fetch]:", error);
    return <NotFound />;
  }

  if (!contentLink) return <NotFound />;

  const bookRepo = new BookRepository(supabase);
  const answerSheetRepo = new AnswerSheetRepository(supabase);

  let book;
  let answerSheet;
  try {
    const result = await Promise.all([
      bookRepo.getBook(contentLink.book_id),
      answerSheetRepo.getAnswerSheetById(params.id),
    ]);
    book = result[0];
    answerSheet = result[1];
  } catch (error: PostgrestError | Error | unknown) {
    console.error("[quiz.[book,answerSheet].fetch]:", error);
    if (error instanceof Error)
      toast.error("Gagal memuat data lembar jawaban", {
        description: error.message,
      });
  }

  const totalPoints =
    answerSheet?.points?.reduce((acc, curr) => acc + curr, 0) ?? 0;

  var subTitle = `${book?.title} • _ _ • _ _`;
  if (answerSheet?.counts) {
    subTitle = subTitle.replace(
      "_ _ • _ _",
      `${answerSheet?.counts} Soal • ${totalPoints} Poin`
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex flex-col gap-2 sticky top-10 pt-10 pb-4 -mt-10 -ms-8 -me-8 px-8 z-10 bg-background bg-opacity-50 backdrop-blur-md">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          {contentLink?.title}
        </h1>
        <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
          {subTitle}
        </p>
      </div>

      <div className="flex flex-col flex-grow md:flex-row gap-8 mt-5">
        {answerSheet ? (
          children
        ) : (
          <NotFound answerSheetId={params.id} bookId={contentLink.book_id} />
        )}
      </div>
    </div>
  );
}
