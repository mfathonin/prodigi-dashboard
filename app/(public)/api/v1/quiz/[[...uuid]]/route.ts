import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supaclient/admin";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";

export async function POST(
  request: Request,
  { params }: { params: { uuid: string[] } }
) {
  const supabase = await createAdminClient();
  const answerSheetRepo = new AnswerSheetRepository(supabase);

  try {
    const uuid = params.uuid[0];
    const body = await request.json();
    const { answers, name, loc } = body;

    // Validate required fields
    if (!uuid || !Array.isArray(answers) || !name || !loc) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!answers.every((answer) => typeof answer === "number")) {
      return NextResponse.json(
        { error: "Answers must be an array of numbers" },
        { status: 400 }
      );
    }

    // Find the answer sheet by UUID
    const answerSheet = await answerSheetRepo.getAnswerSheetById(uuid);

    if (!answerSheet) {
      return NextResponse.json({
        error: "Answer sheet not found",
        status: 404,
      });
    }

    // Validate answers length
    if (answers.length !== answerSheet.counts) {
      return NextResponse.json(
        { error: "Number of submitted answers must match the quiz length" },
        { status: 400 }
      );
    }
    // Calculate score
    const { answers: correctAnswers, counts: totalQuestions } = answerSheet;
    let score = 0;
    let correctAnswersCount = 0;

    answers.forEach((submittedAnswer: number, index: number) => {
      if (
        index < correctAnswers.length &&
        submittedAnswer === correctAnswers[index]
      ) {
        score += answerSheet.points[index];
        correctAnswersCount++;
      }
    });

    // Calculate percentage
    const percentage = (correctAnswersCount / totalQuestions) * 100;

    return NextResponse.json({
      success: true,
      data: {
        points: score,
        score: percentage,
        totalQuestions,
        correctAnswers: correctAnswersCount,
        profile: {
          name,
          loc,
        },
      },
    });
  } catch (error) {
    console.error("Error processing quiz submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
