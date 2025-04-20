import { AnswerSheet } from "@/models";

type QuestionConfig = {
  id: string;
  nOptions: number;
  points: number;
  answer: number | number[];
}

export const getConfigByIndex = (index: number, answerSheet: AnswerSheet): QuestionConfig => {
  const defaultConfig: QuestionConfig = {
    id: answerSheet.uuid,
    nOptions: 0,
    points: 0,
    answer: 0,
  };

  const { n_options, points, answers, uuid } = answerSheet;

  if (!Array.isArray(n_options) || !Array.isArray(points) || !Array.isArray(answers)) {
    return defaultConfig;
  }

  return {
    id: uuid,
    nOptions: n_options[index] ?? 0,
    points: points[index] ?? 0,
    answer: (answers as (number | number[])[])[index] ?? 0,
  };
};
