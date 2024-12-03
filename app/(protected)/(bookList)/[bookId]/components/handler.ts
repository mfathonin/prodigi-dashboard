import {
  ContentUpdateForm,
  ExternalContentUpdateForm,
  QuizUpdateForm,
} from "@/models";
import { ContentsRepository } from "@/repositories/contents";
import { SupabaseClient } from "@supabase/supabase-js";

const addContent = async (
  content: ContentUpdateForm,
  supabase: SupabaseClient
) => {
  if (!content.targetUrl) throw new Error("Target URL is required");

  await new ContentsRepository(supabase).upsertContentLink(
    content as ExternalContentUpdateForm
  );
};

const addQuiz = async (
  content: ContentUpdateForm,
  supabase: SupabaseClient
) => {
  await new ContentsRepository(supabase).upsertQuiz(content as QuizUpdateForm);
};

export const handleContentForm = async (result: ContentUpdateForm) => {
  if (result) {
    const supabase = (await import("@/lib/supaclient/client")).createClient();

    // console.log("on create content link", { result });

    switch ((result as ContentUpdateForm).type) {
      case "content":
        await addContent(result as ContentUpdateForm, supabase);
        break;
      case "quiz":
        await addQuiz(result as ContentUpdateForm, supabase);
        break;
    }
  }
};
