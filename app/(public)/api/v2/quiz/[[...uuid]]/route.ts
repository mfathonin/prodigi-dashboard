import { z } from "zod";

import { ApiResponseHandler } from "@/lib/api-response";
import { constants } from "@/lib/constants";
import { createAdminClient } from "@/lib/supaclient/admin";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";

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

const inputSchema = z.object({
  answers: z.array(z.number()).min(1),
  name: z.string().min(1),
  className: z.string().min(1),
  numberId: z.string().min(1),
  schoolName: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: { uuid: string[] } }
) {
  const supabase = await createAdminClient();
  const answerSheetRepo = new AnswerSheetRepository(supabase);

  try {
    const uuid = params.uuid[0];
    if (!uuidValidation.pattern.test(uuid)) {
      return ApiResponseHandler.error(INVALID_UUID);
    }

    let rawBody;
    try {
      rawBody = await request.json();
    } catch (error) {
      return ApiResponseHandler.error(INVALID_JSON);
    }

    // Validate required fields
    const { data: body, success } = inputSchema.safeParse(rawBody);
    if (!success) {
      return ApiResponseHandler.error(QUIZ_MISSING_FIELDS);
    }

    const { answers, ...profile } = body;

    if (!answers.every((answer) => typeof answer === "number")) {
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
        if (index < answerKey.length && submittedAnswer === answerKey[index]) {
          acc.totalPoints += answerSheet.points[index];
          acc.correctAnswers++;
        }
        return acc;
      },
      { totalPoints: 0, correctAnswers: 0 }
    );

    // Calculate percentage
    const percentage = (correctAnswers / totalQuestions) * 100;

    return ApiResponseHandler.success({
      profile,
      totalPoints,
      percentage,
      totalQuestions,
      correctAnswers,
    });
  } catch (error) {
    console.error("Error processing quiz submission:", error);
    return ApiResponseHandler.error(UNKNOWN);
  }
}
