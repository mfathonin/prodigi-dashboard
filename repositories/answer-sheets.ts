import { Database } from "@/models/supaservice.types";
import { SupabaseClient } from "@supabase/supabase-js";

export class AnswerSheetRepository {
  private db: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.db = supabase;
  }

  getAnswerSheetById = async (answerSheetId: string) => {
    const { data, error } = await this.db
      .from("answer_sheets")
      .select("*")
      .eq("uuid", answerSheetId)
      .single();

    if (error) {
      console.error(error);

      if (error.code === "PGRST116") return null;

      throw { message: "Something went wrong", error };
    }

    return data;
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

    const { data: existingData, error: existingError } = await this.db
      .from("answer_sheets")
      .select("*")
      .eq("uuid", answerSheetId)
      .single();

    if (existingError || !existingData)
      throw { message: "Data tidak ditemukan" };
    const {
      counts: oldCounts,
      n_options: oldNOptions,
      points: oldPoints,
    } = existingData;

    const new_n_options =
      nOptions && oldCounts >= counts
        ? Array(counts).fill(nOptions)
        : counts > oldCounts
        ? Array(counts).fill(nOptions ?? oldNOptions[0])
        : undefined;
    const new_points =
      points && oldCounts >= counts
        ? Array(counts).fill(points)
        : counts > oldCounts
        ? Array(counts).fill(points ?? oldPoints[0])
        : undefined;

    // update answer_sheets
    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({
        counts,
        n_options: new_n_options,
        points: new_points,
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
    const { data: existingData, error: existingError } = await this.db
      .from("answer_sheets")
      .select("*")
      .eq("uuid", answerSheetId)
      .single();

    if (existingError || !existingData)
      throw { message: "Data tidak ditemukan" };

    const newNOptions = [...existingData.n_options];
    newNOptions[index] =
      type === "increase" ? newNOptions[index] + 1 : newNOptions[index] - 1;

    newNOptions[index] = Math.max(2, Math.min(5, newNOptions[index]));

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
    const { data: existingData, error: existingError } = await this.db
      .from("answer_sheets")
      .select("*")
      .eq("uuid", answerSheetId)
      .single();

    if (existingError || !existingData)
      throw { message: "Data tidak ditemukan" };

    const newPoints = [...existingData.points];
    newPoints[index] =
      type === "increase" ? newPoints[index] + 1 : newPoints[index] - 1;

    const { error: updateError } = await this.db
      .from("answer_sheets")
      .update({ points: newPoints })
      .eq("uuid", answerSheetId);

    if (updateError) throw { message: "Gagal mengupdate data" };
  };

  updateAnswers = async (answerSheetId: string, answers: number[]) => {
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
