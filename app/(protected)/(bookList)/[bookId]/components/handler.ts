import {
  ContentUpdateForm,
  isExternalContent,
  isQuizContent,
  validateExternalContent,
  validateQuizContent,
} from "@/models";
import { ContentsRepository } from "@/repositories/contents";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supaclient/client";

const addContent = async (
  content: ContentUpdateForm,
  supabase: SupabaseClient
) => {
  if (!isExternalContent(content)) {
    throw new Error("Invalid content type");
  }
  validateExternalContent(content);

  await new ContentsRepository(supabase).upsertContentLink(content);
};

const addQuiz = async (
  content: ContentUpdateForm,
  supabase: SupabaseClient
) => {
  if (!isQuizContent(content)) {
    throw new Error("Invalid quiz content");
  }
  validateQuizContent(content);

  await new ContentsRepository(supabase).upsertQuiz(content);
};

const supabaseClient = createClient();

export const handleContentForm = async (result: ContentUpdateForm) => {
  if (result) {
    // console.log("on create content link", { result });

    switch (result.type) {
      case "content":
        await addContent(result as ContentUpdateForm, supabaseClient);
        break;
      case "quiz":
        await addQuiz(result as ContentUpdateForm, supabaseClient);
        break;
      default:
        throw new Error(`Unsupported content type: ${result.type}`);
    }
  }
};
