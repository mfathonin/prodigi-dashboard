import { constants } from "@/lib/constants";
import { AnswerSheet } from "@/models";
import { execute, queryOne } from "@/lib/db/utils";

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

function parseNumArray(v: unknown): number[] {
  if (Array.isArray(v)) return v as number[];
  try {
    return JSON.parse(String(v || "[]"));
  } catch {
    return [];
  }
}

function parseAnswerArray(v: unknown): (number | number[])[] {
  if (Array.isArray(v)) return v as (number | number[])[];
  try {
    return JSON.parse(String(v || "[]"));
  } catch {
    return [];
  }
}

export class AnswerSheetRepository implements AnswerSheets {
  constructor(_supabase: any) {}

  private toAnswerSheet(row: any): AnswerSheet {
    return {
      ...row,
      counts: Number(row.counts),
      n_options: parseNumArray(row.n_options),
      points: parseNumArray(row.points),
      answers: parseAnswerArray(row.answers) as any,
    } as AnswerSheet;
  }

  private validateAnswer = (
    answer: number | number[],
    nOptions: number
  ): number | number[] => {
    if (!Array.isArray(answer)) {
      return answer >= 0 && answer < nOptions ? answer : 0;
    }

    const validOptions = [...new Set(answer)].filter(
      (opt) => opt >= 0 && opt < nOptions
    );

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
    const row = await queryOne<any>(
      `select * from answer_sheets where uuid = ? limit 1`,
      [answerSheetId]
    );

    if (!row) return null;

    return this.toAnswerSheet(row);
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

    newAnswers = newAnswers.map((answer, index) =>
      this.validateAnswer(answer, newNOptions[index])
    );

    await execute(
      `update answer_sheets
       set counts = ?, n_options = ?, points = ?, answers = ?, updated_at = ?
       where uuid = ?`,
      [
        counts,
        JSON.stringify(newNOptions),
        JSON.stringify(newPoints),
        JSON.stringify(newAnswers),
        new Date().toISOString(),
        answerSheetId,
      ]
    );
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

    const existingAnswers = existingData.answers as (number | number[])[];
    const updatedAnswers = [...existingAnswers];
    updatedAnswers[index] = this.validateAnswer(
      existingAnswers[index],
      newNOptions[index]
    );

    await execute(
      `update answer_sheets set n_options = ?, answers = ?, updated_at = ? where uuid = ?`,
      [
        JSON.stringify(newNOptions),
        JSON.stringify(updatedAnswers),
        new Date().toISOString(),
        answerSheetId,
      ]
    );
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

    await execute(
      `update answer_sheets set points = ?, updated_at = ? where uuid = ?`,
      [JSON.stringify(newPoints), new Date().toISOString(), answerSheetId]
    );
  };

  updateAnswers = async (
    answerSheetId: string,
    answers: (number | number[])[]
  ) => {
    const existingData = await this.getAnswerSheetById(answerSheetId);
    if (!existingData) throw { message: "AnswerSheet not found" };

    if (answers.length !== existingData.counts)
      throw { message: "Invalid answers array length" };

    const validatedAnswers = answers.map((answer, index) =>
      this.validateAnswer(answer, existingData.n_options[index])
    );

    const hasInvalidAnswers = validatedAnswers.some((validAnswer, index) => {
      const originalAnswer = answers[index];

      if (!Array.isArray(originalAnswer) && !Array.isArray(validAnswer)) {
        return originalAnswer !== validAnswer;
      }

      if (Array.isArray(originalAnswer) && Array.isArray(validAnswer)) {
        return (
          originalAnswer.length !== validAnswer.length ||
          !originalAnswer.every((val) => validAnswer.includes(val))
        );
      }

      return true;
    });

    if (hasInvalidAnswers) {
      throw { message: "Invalid answer values" };
    }

    await execute(
      `update answer_sheets set answers = ?, updated_at = ? where uuid = ?`,
      [JSON.stringify(answers), new Date().toISOString(), answerSheetId]
    );
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

    const now = new Date().toISOString();
    const existing = await queryOne<{ uuid: string }>(
      `select uuid from answer_sheets where uuid = ?`,
      [answerSheetId]
    );

    if (existing) {
      await execute(
        `update answer_sheets
         set book_id = ?, counts = ?, n_options = ?, points = ?, answers = ?, updated_at = ?
         where uuid = ?`,
        [
          bookId,
          counts,
          JSON.stringify(Array(counts).fill(nOption)),
          JSON.stringify(Array(counts).fill(points)),
          JSON.stringify(Array(counts).fill(0)),
          now,
          answerSheetId,
        ]
      );
    } else {
      await execute(
        `insert into answer_sheets
         (uuid, book_id, counts, n_options, points, answers, created_at, updated_at)
         values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          answerSheetId,
          bookId,
          counts,
          JSON.stringify(Array(counts).fill(nOption)),
          JSON.stringify(Array(counts).fill(points)),
          JSON.stringify(Array(counts).fill(0)),
          now,
          now,
        ]
      );
    }
  };
}
