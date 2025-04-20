import {
  ContentUpdateForm,
  isExternalContent,
  isAnswerSheetContent,
  validateExternalContent,
  validateAnswerSheetContent,
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

const addAnswerSheet = async (
  content: ContentUpdateForm,
  supabase: SupabaseClient
) => {
  if (!isAnswerSheetContent(content)) {
    throw new Error("Invalid answer sheet content");
  }
  validateAnswerSheetContent(content);

  await new ContentsRepository(supabase).upsertAnswerSheet(content);
};

const supabaseClient = createClient();

export const handleContentForm = async (result: ContentUpdateForm) => {
  if (result) {
    // console.log("on create content link", { result });

    switch (result.type) {
      case "content":
        await addContent(result as ContentUpdateForm, supabaseClient);
        break;
      case "answer_sheet":
        await addAnswerSheet(result as ContentUpdateForm, supabaseClient);
        break;
      default:
        throw new Error(`Unsupported content type: ${result.type}`);
    }
  }
};
