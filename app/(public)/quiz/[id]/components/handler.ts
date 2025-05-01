"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supaclient/server";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";
import { ContentsRepository } from "@/repositories/contents";

const resetAnswerSheetConfigSchema = z.object({
  answerSheetId: z.string(),
  data: z.object({
    counts: z.number().min(1),
    nOptions: z.number().min(2).max(5).optional(),
    points: z.number().min(1).optional(),
  }),
});

const updateItemSchema = z.object({
  answerSheetId: z.string(),
  index: z.number(),
});

const updateAnswerSheetSchema = z
  .object({
    answerSheetId: z.string(),
    counts: z.number(),
    answers: z.array(z.union([z.number(), z.array(z.number())])),
  })
  .refine((data) => data.answers.length === data.counts, {
    message: "Jumlah jawaban tidak sama dengan jumlah soal",
    path: ["answers"],
  });

const recreateAnswerSheetSchema = z.object({
  answerSheetId: z.string(),
  bookId: z.string(),
  counts: z.number(),
  nOptions: z.number(),
  points: z.number(),
});

const parseData = (formData: FormData, key: string) => {
  const data = formData.get(key) as string;
  return data ? parseInt(data) : undefined;
};

// Initialize the repository
const supabase = createClient();
const answerSheetRepo = new AnswerSheetRepository(supabase);
const contentRepo = new ContentsRepository(supabase);

/**
 * Functions format in this form-handler:
 *
 * - parse the data from formData
 * - validate the data with zod
 * - call the repository method
 * - revalidate the path
 */

export const updateGeneralSettings = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const data = {
    counts: parseInt(formData.get("counts") as string),
    nOptions: parseData(formData, "nOptions"),
    points: parseData(formData, "points"),
  };

  const { error } = resetAnswerSheetConfigSchema.safeParse({
    answerSheetId,
    data,
  });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.resetAnswerSheetConfig(answerSheetId, data);

  revalidatePath(`/quiz/${answerSheetId}`);
};

export const increaseNOption = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const index = parseInt(formData.get("index") as string);

  const { error } = updateItemSchema.safeParse({ answerSheetId, index });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.updateNOption(answerSheetId, index, "increase");
  revalidatePath(`/quiz/${answerSheetId}`);
};

export const decreaseNOption = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const index = parseInt(formData.get("index") as string);

  const { error } = updateItemSchema.safeParse({ answerSheetId, index });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.updateNOption(answerSheetId, index, "decrease");
  revalidatePath(`/quiz/${answerSheetId}`);
};

export const increasePoints = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const index = parseInt(formData.get("index") as string);

  const { error } = updateItemSchema.safeParse({ answerSheetId, index });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.updatePoints(answerSheetId, index, "increase");
  revalidatePath(`/quiz/${answerSheetId}`);
};

export const decreasePoints = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const index = parseInt(formData.get("index") as string);

  const { error } = updateItemSchema.safeParse({ answerSheetId, index });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.updatePoints(answerSheetId, index, "decrease");

  revalidatePath(`/quiz/${answerSheetId}`);
};

export const updateAnswerSheet = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const counts = parseInt(formData.get("counts") as string);

  let answers: (number | number[])[] = [];

  try {
    // First try to parse from the "answers" JSON field
    const answersJson = formData.get("answers");
    if (answersJson) {
      const parsed = JSON.parse(answersJson as string);
      if (Array.isArray(parsed)) {
        answers = parsed;
      }
    }

    // If no answers from JSON, try individual answer fields
    if (answers.length === 0) {
      answers = formData.getAll("answer").map((answerStr) => {
        if (typeof answerStr !== "string") return 0;

        if (answerStr.includes(",")) {
          // Handle multi-answer case
          return answerStr
            .split(",")
            .map((num) => parseInt(num.trim()))
            .filter((num) => !isNaN(num));
        } else {
          // Handle single answer case
          const num = parseInt(answerStr);
          return isNaN(num) ? 0 : num;
        }
      });
    }
  } catch (error) {
    console.error("Error parsing answers:", error);
    throw { message: "Failed to parse answers", error };
  }

  const { error } = updateAnswerSheetSchema.safeParse({
    answerSheetId,
    counts,
    answers,
  });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.updateAnswers(answerSheetId, answers);

  revalidatePath(`/quiz/${answerSheetId}`);
};

export const recreateAnswerSheet = async (formData: FormData) => {
  const answerSheetId = formData.get("answerSheetId") as string;
  const bookId = formData.get("bookId") as string;
  const counts = parseInt(formData.get("counts") as string);
  const nOptions = parseInt(formData.get("nOptions") as string);
  const points = parseInt(formData.get("points") as string);

  const { error } = recreateAnswerSheetSchema.safeParse({
    answerSheetId,
    bookId,
    counts,
    nOptions,
    points,
  });
  if (error) throw { message: "Invalid data", error };

  await answerSheetRepo.recreateAnswerSheet(
    answerSheetId,
    bookId,
    counts,
    nOptions,
    points
  );

  revalidatePath(`/quiz/${answerSheetId}`);

  // ensure content type is correct
  await contentRepo.ensureAnswerSheetContentType(answerSheetId);

  revalidatePath(`/${bookId}`);
};
