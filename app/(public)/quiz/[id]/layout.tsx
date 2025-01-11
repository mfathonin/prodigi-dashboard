import { Metadata } from "next";

import GlobalNotFound from "@/app/not-found";
import { createClient } from "@/lib/supaclient/server";
import { cn } from "@/lib/utils";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";

import NotFound from "./not-found";

export default async function QuizLayout({
  children,
  preview,
  params,
}: {
  children: React.ReactNode;
  preview: React.ReactNode;
  params: { id: string };
}) {
  const supabase = createClient();
  const contentRepo = new ContentsRepository(supabase);
  let contentLink;
  let isAuthenticated: boolean = false;
  const [ct, auth] = await Promise.allSettled([
    contentRepo.getContentLinkByTargetUrl(`/quiz/${params.id}`),
    supabase.auth.getUser(),
  ]);

  if (auth.status === "fulfilled")
    isAuthenticated = Boolean(auth.value.data.user);

  if (ct.status === "fulfilled") contentLink = ct.value;
  else {
    console.error("[quiz.contentLink.fetch]:", ct.reason);
    return isAuthenticated ? <NotFound /> : <GlobalNotFound />;
  }

  if (!contentLink) return isAuthenticated ? <NotFound /> : <GlobalNotFound />;

  const bookRepo = new BookRepository(supabase);
  const answerSheetRepo = new AnswerSheetRepository(supabase);

  let book;
  let answerSheet;
  const [bookRes, answerRes] = await Promise.allSettled([
    bookRepo.getBook(contentLink.book_id),
    answerSheetRepo.getAnswerSheetById(params.id),
  ]);
  if (bookRes.status === "fulfilled") book = bookRes.value;
  else console.error("[quiz.[book].fetch]:", bookRes.reason);

  if (answerRes.status === "fulfilled") answerSheet = answerRes.value;
  else console.error("[quiz.[answerSheet].fetch]:", answerRes.reason);

  const totalPoints =
    answerSheet?.points?.reduce((acc, curr) => acc + curr, 0) ?? 0;

  var subTitle = `${book?.title} • _ _ • _ _`;
  if (answerSheet?.counts) {
    subTitle = subTitle.replace(
      "_ _ • _ _",
      `${answerSheet?.counts} Soal • ${totalPoints} Poin`
    );
  }
  if (book && !isAuthenticated) subTitle = subTitle.split("•")[0].trim();

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div
        className={cn(
          isAuthenticated ? "sticky" : "",
          "flex flex-col gap-2 sticky top-10 pt-10 pb-4 -mt-10 -ms-8 -me-8 px-8 z-10 bg-background bg-opacity-50 backdrop-blur-md"
        )}
      >
        {!isAuthenticated && (
          <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
            Lembar Kerja
          </p>
        )}
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          {contentLink?.title}
        </h1>
        <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
          {subTitle}
        </p>
      </div>

      <div className="flex flex-col flex-grow md:flex-row gap-8 mt-5">
        {isAuthenticated ? (
          answerSheet ? (
            children
          ) : (
            <NotFound answerSheetId={params.id} bookId={contentLink.book_id} />
          )
        ) : (
          preview
        )}
      </div>
    </div>
  );
}
