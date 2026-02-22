import { Database, Tables } from "@/models/supaservice.types";
import { constants } from "@/lib/constants";
import { AnswerSheet } from "@/models";

const { MIN_OPTIONS, MAX_OPTIONS } = constants.quizConfig;

interface AnswerSheets {
  getAnswerSheetById: (answerSheetId: string) => Promise<AnswerSheet | null>;
  resetAnswerSheetConfig: (
    answerSheetId: string,
    data: {
      counts: number;
      nOptions?: number;
      points?: number;
    }
  ) => Promise<void>;
  updateNOption: (
    answerSheetId: string,
    index: number,
    type: "increase" | "decrease"
  ) => Promise<void>;
  updatePoints: (
    answerSheetId: string,
    index: number,
    type: "increase" | "decrease"
  ) => Promise<void>;
  updateAnswers: (
    answerSheetId: string,
    answers: (number | number[])[]
  ) => Promise<void>;
  recreateAnswerSheet: (
    answerSheetId: string,
    bookId: string,
    counts: number,
    nOption: number,
    points: number
  ) => Promise<void>;
}

export class AnswerSheetRepository implements AnswerSheets {
  private db: any;

  constructor(supabase: any) {
    this.db = supabase;
  }

  /**
   * Validates an answer against the number of options
   * @param answer The answer to validate (single number or array of numbers)
   * @param nOptions The number of options available for this question
   * @returns The validated answer (corrected if needed)
   */
  private validateAnswer = (
    answer: number | number[],
    nOptions: number
  ): number | number[] => {
    // For single answer
    if (!Array.isArray(answer)) {
      return answer >= 0 && answer < nOptions ? answer : 0;
    }

    // For array answers
    // Filter valid options and ensure uniqueness
    const validOptions = [...new Set(answer)].filter(
      (opt) => opt >= 0 && opt < nOptions
    );

    // Return [0] if no valid options or empty array
    return validOptions.length > 0 ? validOptions : [0];
  };

  private createConfigArray = <T extends number | number[]>(
    newValue: T | undefined,
    oldValue: T[],
    newCount: number,
    oldCount: number
  ): T[] => {
    const baseValue = newValue ?? oldValue[0];
    const newArray = Array.from({ length: newCount }, () =>
      Array.isArray(baseValue) ? [...baseValue] : (baseValue as number)
    ) as T[];

    // Copy existing values up to the new count
    if (!newValue) {
      for (let i = 0; i < Math.min(newCount, oldCount); i++) {
        newArray[i] = oldValue[i];
      }
    }

    return newArray;
  };

  getAnswerSheetById = async (
    answerSheetId: string
  ): Promise<AnswerSheet | null> => {
    const { data, error } = await this.db
      .from("answer_sheets")
      .select("*")
      .eq("uuid", answerSheetId)
      .single();

    if (error) {
      console.error(`Error fetching answer sheet ${answerSheetId}:`, error);

      if (error.code === "PGRST116") return null;

      throw { message: "Failed to fetch answer sheet", error };
    }

    return data as AnswerSheet;
  };

  resetAnswerSheetConfig = async (
    answerSheetId: string,
    data: {
      counts: number;
      nOptions?: number;
      points?: number;
    }
  ) => {
    const { counts, nOptions, points } = data;

    const existingData = await this.getAnswerSheetById(answerSheetId);
    if (!existingData) throw { message: "Data tidak ditemukan" };

    const {
      counts: oldCounts,
      n_options: oldNOptions,
      points: oldPoints,
      answers: oldAnswers,
    } = existingData;

    const newNOptions = this.createConfigArray(
      nOptions,
      oldNOptions,
      counts,
      oldCounts
    );
    const newPoints = this.createConfigArray(
      points,
      oldPoints,
      counts,
      oldCounts
    );
    let newAnswers = this.createConfigArray(
      0,
      oldAnswers as (number | number[])[],
      counts,
      oldCounts
    );

    // Validate each answer using the validator function
    newAnswers = newAnswers.map((answer, index) =>
      this.validateAnswer(answer, newNOptions[index])
    );

    // update answer_sheets
    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({
        counts,
        n_options: newNOptions,
        points: newPoints,
        answers: newAnswers,
      })
      .eq("uuid", answerSheetId);

    if (updateError)
      throw { message: "Gagal mengupdate data", error: updateError };
  };

  updateNOption = async (
    answerSheetId: string,
    index: number,
    type: "increase" | "decrease"
  ) => {
    if (index < 0) throw { message: "Invalid index" };

    const existingData = await this.getAnswerSheetById(answerSheetId);
    if (!existingData) throw { message: "Data tidak ditemukan" };

    const newNOptions = [...existingData.n_options];
    if (index >= newNOptions.length) throw { message: "Index out of bounds" };

    newNOptions[index] =
      type === "increase" ? newNOptions[index] + 1 : newNOptions[index] - 1;

    newNOptions[index] = Math.max(
      MIN_OPTIONS,
      Math.min(MAX_OPTIONS, newNOptions[index])
    );

    // Validate answer is in range using the validator function
    const existingAnswers = existingData.answers as (number | number[])[];
    const updatedAnswers = [...existingAnswers];
    updatedAnswers[index] = this.validateAnswer(
      existingAnswers[index],
      newNOptions[index]
    );

    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({ n_options: newNOptions, answers: updatedAnswers })
      .eq("uuid", answerSheetId);

    if (updateError)
      throw { message: "Gagal mengupdate data", error: updateError };
  };

  updatePoints = async (
    answerSheetId: string,
    index: number,
    type: "increase" | "decrease"
  ) => {
    if (index < 0) throw { message: "Invalid index" };

    const existingData = await this.getAnswerSheetById(answerSheetId);
    if (!existingData) throw { message: "Data tidak ditemukan" };

    const newPoints = [...existingData.points];
    if (index >= newPoints.length) throw { message: "Index out of bounds" };

    newPoints[index] =
      type === "increase" ? newPoints[index] + 1 : newPoints[index] - 1;

    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({ points: newPoints })
      .eq("uuid", answerSheetId);

    if (updateError)
      throw { message: "Gagal mengupdate data", error: updateError };
  };

  updateAnswers = async (
    answerSheetId: string,
    answers: (number | number[])[]
  ) => {
    const existingData = await this.getAnswerSheetById(answerSheetId);
    if (!existingData) throw { message: "AnswerSheet not found" };

    if (answers.length !== existingData.counts)
      throw { message: "Invalid answers array length" };

    // Validate all answers using the validator function
    const validatedAnswers = answers.map((answer, index) =>
      this.validateAnswer(answer, existingData.n_options[index])
    );

    // Check if any answer was invalid and needed correction
    const hasInvalidAnswers = validatedAnswers.some((validAnswer, index) => {
      const originalAnswer = answers[index];

      // For single answers
      if (!Array.isArray(originalAnswer) && !Array.isArray(validAnswer)) {
        return originalAnswer !== validAnswer;
      }

      // For array answers
      if (Array.isArray(originalAnswer) && Array.isArray(validAnswer)) {
        // Check if arrays have different lengths or different content
        return (
          originalAnswer.length !== validAnswer.length ||
          !originalAnswer.every((val) => validAnswer.includes(val))
        );
      }

      // Type mismatch (shouldn't happen in normal operation)
      return true;
    });

    if (hasInvalidAnswers) {
      throw { message: "Invalid answer values" };
    }

    const { error } = await this.db
      .from("answer_sheets")
      .update({ answers })
      .eq("uuid", answerSheetId);

    if (error) throw { message: "Gagal mengupdate data", error };
  };

  recreateAnswerSheet = async (
    answerSheetId: string,
    bookId: string,
    counts: number,
    nOption: number,
    points: number
  ) => {
    if (counts <= 0) throw { message: "Invalid counts value" };

    if (nOption < MIN_OPTIONS || nOption > MAX_OPTIONS)
      throw { message: "Invalid nOption value" };

    const { error } = await this.db.from("answer_sheets").upsert({
      uuid: answerSheetId,
      book_id: bookId,
      counts,
      n_options: Array(counts).fill(nOption),
      points: Array(counts).fill(points),
      answers: Array(counts).fill(0),
    });

    if (error) throw { message: "Gagal membuat data", error };
  };
}
