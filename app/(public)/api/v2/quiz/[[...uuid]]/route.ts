import { z } from "zod";

import { ApiResponseHandler } from "@/lib/api-response";
import { constants } from "@/lib/constants";
import { createAdminClient } from "@/lib/supaclient/admin";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";

const {
  validation: { uuid: uuidValidation },
  errors: {
    quiz: {
      QUIZ_ANSWERS_LENGTH,
      QUIZ_ANSWERS_NOT_ARRAY,
      QUIZ_MISSING_FIELDS,
      QUIZ_NOT_FOUND,
    },
    general: { UNKNOWN, INVALID_JSON, INVALID_UUID },
  },
} = constants;

const submissionSchema = z.object({
  answers: z.array(z.union([z.number(), z.array(z.number())])).min(1),
  name: z.string().min(1),
  className: z.string().min(1),
  numberId: z.string().min(1),
  schoolName: z.string().min(1),
});

/**
 * API handler for quiz submission evaluation.
 *
 * This handler processes quiz submissions, evaluates them, and returns the result.
 *
 * @param request - submission data
 * @param params - params to load answer sheet Id
 * @returns
 */
export async function POST(
  request: Request,
  { params }: { params: { uuid: string[] } }
) {
  const supabase = await createAdminClient();
  const answerSheetRepo = new AnswerSheetRepository(supabase);

  const uuid = params.uuid[0];
  if (!uuidValidation.pattern.test(uuid))
    return ApiResponseHandler.error(INVALID_UUID);

  try {
    let rawBody;
    try {
      rawBody = await request.json();
    } catch (error) {
      return ApiResponseHandler.error(INVALID_JSON);
    }

    // Validate required fields
    const { data: body, success } = submissionSchema.safeParse(rawBody);
    if (!success) {
      return ApiResponseHandler.error(QUIZ_MISSING_FIELDS);
    }

    const { answers, ...profile } = body;

    if (
      !answers.every(
        (answer) =>
          typeof answer === "number" ||
          (Array.isArray(answer) && answer.every((a) => typeof a === "number"))
      )
    ) {
      return ApiResponseHandler.error(QUIZ_ANSWERS_NOT_ARRAY);
    }

    // Find the answer sheet by UUID
    const answerSheet = await answerSheetRepo.getAnswerSheetById(uuid);

    if (!answerSheet) {
      return ApiResponseHandler.error(QUIZ_NOT_FOUND);
    }

    // Validate answers length
    if (answers.length !== answerSheet.counts) {
      return ApiResponseHandler.error(QUIZ_ANSWERS_LENGTH);
    }

    // Calculate score
    const { answers: answerKey, counts: totalQuestions } = answerSheet;

    const { totalPoints, correctAnswers } = answers.reduce(
      (acc, submittedAnswer, index) => {
        const keys = answerKey as (number | number[])[];
        if (index < keys.length) {
          if (!Array.isArray(keys[index]) && submittedAnswer === keys[index]) {
            acc.totalPoints += answerSheet.points[index];
            acc.correctAnswers++;
          } else if (
            Array.isArray(keys[index]) &&
            Array.isArray(submittedAnswer)
          ) {
            const keySet = new Set(keys[index] as number[]);
            const submittedSet = new Set(submittedAnswer);
            const isCorrect =
              keySet.size === submittedSet.size &&
              [...keySet].every((a) => submittedSet.has(a));

            if (isCorrect) {
              acc.totalPoints += answerSheet.points[index];
              acc.correctAnswers++;
            }
          }
        }
        return acc;
      },
      { totalPoints: 0, correctAnswers: 0 }
    );

    const fullPoints = answerSheet.points.reduce((p, sum) => sum + p, 0);

    // Calculate percentage
    const percentage = (correctAnswers / totalQuestions) * 100;

    const result = {
      profile,
      totalPoints,
      fullPoints,
      percentage,
      totalQuestions,
      correctAnswers,
    };

    console.log(1349, "submission result", { id: uuid, ...result });

    return ApiResponseHandler.success(result);
  } catch (error) {
    console.error(1349, `quiz.submission.${uuid}`, error);
    return ApiResponseHandler.error(UNKNOWN);
  }
}

export async function GET(
  request: Request,
  { params }: { params: { uuid: string[] } }
) {
  const id = params.uuid[0];
  const isValidId = uuidValidation.pattern.test(id);
  if (!isValidId) return ApiResponseHandler.error(INVALID_UUID);

  const supabase = await createAdminClient();
  const repo = new AnswerSheetRepository(supabase);

  try {
    const result = await repo.getAnswerSheetById(id);
    if (!result) return ApiResponseHandler.error(QUIZ_NOT_FOUND);

    const { answers, created_at, updated_at, ...answerSheets } = result;

    const contentRepo = new ContentsRepository(supabase);
    const bookRepo = new BookRepository(supabase);

    const [bookPromise, contentPromise] = await Promise.allSettled([
      bookRepo.getBook(answerSheets.book_id),
      contentRepo.getContentLinkByTargetPath(`/quiz/${id}`),
    ]);

    bookPromise.status === "fulfilled" &&
      Object.assign(answerSheets, { bookTitle: bookPromise.value?.title });
    contentPromise.status === "fulfilled" &&
      Object.assign(answerSheets, {
        contentTitle: contentPromise.value?.title,
      });

    // Adding answers type mode to answerSheets object
    const answersTypeMode = (answers as (number | number[])[]).map((answer) =>
      // 0: single choice, 1: multiple choice
      Array.isArray(answer) ? 1 : 0
    );
    Object.assign(answerSheets, {
      mode: answersTypeMode,
    });

    return ApiResponseHandler.success(answerSheets);
  } catch (error: unknown) {
    console.error(1349, `get.quiz.${id}`, error);
    return ApiResponseHandler.error(UNKNOWN);
  }
}
