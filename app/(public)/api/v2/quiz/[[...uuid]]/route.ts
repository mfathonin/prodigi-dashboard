import { z } from "zod";

import { ApiResponseHandler } from "@/lib/api-response";
import { constants } from "@/lib/constants";
import { createAdminClient } from "@/lib/supaclient/admin";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";

const {
  errors: {
    quiz: {
      QUIZ_ANSWERS_LENGTH,
      QUIZ_ANSWERS_NOT_ARRAY,
      QUIZ_MISSING_FIELDS,
      QUIZ_NOT_FOUND,
    },
    general: { UNKNOWN },
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
    const rawBody = await request.json();

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
    const { answers: correctAnswers, counts: totalQuestions } = answerSheet;
    let points = 0;
    let correctAnswersCount = 0;

    answers.forEach((submittedAnswer: number, index: number) => {
      if (
        index < correctAnswers.length &&
        submittedAnswer === correctAnswers[index]
      ) {
        points += answerSheet.points[index];
        correctAnswersCount++;
      }
    });

    // Calculate percentage
    const percentage = (correctAnswersCount / totalQuestions) * 100;

    return ApiResponseHandler.success({
      profile,
      points,
      percentage,
      totalQuestions,
      correctAnswers: correctAnswersCount,
    });
  } catch (error) {
    console.error("Error processing quiz submission:", error);
    return ApiResponseHandler.error(UNKNOWN);
  }
}
