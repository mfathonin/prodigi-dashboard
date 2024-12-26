import { Database, Tables } from "@/models/supaservice.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { constants } from "@/lib/constants";

const { MIN_OPTIONS, MAX_OPTIONS } = constants.quizConfig;

type AnswerSheet = Tables<"answer_sheets">;

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
  ): number[] | undefined => {
    if (newValue && oldCount >= newCount) {
      return Array(newCount).fill(newValue);
    }
    if (newCount > oldCount) {
      return Array(newCount).fill(newValue ?? oldValue[0]);
    }
    return undefined;
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
    } = existingData;

    const newNOptions = this.createConfigArray(nOptions, oldNOptions, counts, oldCounts);
    const newPoints = this.createConfigArray(points, oldPoints, counts, oldCounts);

    // update answer_sheets
    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({
        counts,
        n_options: newNOptions,
        points: newPoints,
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

    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({ n_options: newNOptions })
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
        (answer) => answer >= 0 && answer < existingData.n_options[0]
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
