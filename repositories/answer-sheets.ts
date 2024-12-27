import { Database, Tables } from "@/models/supaservice.types";
import { SupabaseClient } from "@supabase/supabase-js";
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
  updateAnswers: (answerSheetId: string, answers: number[]) => Promise<void>;
  recreateAnswerSheet: (
    answerSheetId: string,
    bookId: string,
    counts: number,
    nOption: number,
    points: number
  ) => Promise<void>;
}

export class AnswerSheetRepository implements AnswerSheets {
  private db: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.db = supabase;
  }

  private createConfigArray = (
    newValue: number | undefined,
    oldValue: number[],
    newCount: number,
    oldCount: number
  ): number[] => {
    const baseValue = newValue ?? oldValue[0];
    const newArray = Array(newCount).fill(baseValue);

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

    const newNOptions = this.createConfigArray(nOptions, oldNOptions, counts, oldCounts);
    const newPoints = this.createConfigArray(points, oldPoints, counts, oldCounts);
    let newAnswers = this.createConfigArray(undefined, oldAnswers, counts, oldCounts);

    // validate each answer is in range
    newAnswers = newAnswers.map((answer, index) => {
      if (answer < 0 || answer >= newNOptions[index]) return 0;
      return answer;
    });

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

    // validate answer is in range, reset to 0 if out of range
    const updatedAnswers = [...existingData.answers];
    if (existingData.answers[index] >= newNOptions[index])
      updatedAnswers[index] = 0;

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

  updateAnswers = async (answerSheetId: string, answers: number[]) => {
    const existingData = await this.getAnswerSheetById(answerSheetId);
    if (!existingData) throw { message: "AnswerSheet not found" };

    if (answers.length !== existingData.counts)
      throw { message: "Invalid answers array length" };

    if (
      !answers.every(
        (answer, index) => answer >= 0 && answer < existingData.n_options[index]
      )
    )
      throw { message: "Invalid answer values" };

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
