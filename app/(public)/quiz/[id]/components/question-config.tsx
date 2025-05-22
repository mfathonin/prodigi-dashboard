import { Badge } from "@/components/ui/badge";
import { MultiAnswerForm, OptionsForm, PointsForm } from "./forms";

type QuestionConfigProps = {
  data: {
    id: string;
    nOptions: number;
    points: number;
    answers: (number | number[])[];
  };
  index: number;
};

export default function QuestionConfig({ data, index }: QuestionConfigProps) {
  const {
    nOptions: dataNOptions,
    points: dataPoints,
    id: answerSheetId,
    answers
  } = data;

  return (
    <div className="hidden md:flex max-w-xl flex-1 flex-row justify-start items-end pb-3 mb-3 gap-y-4 gap-x-2 border-b border-gray-200 dark:border-gray-800 first:mt-4 last:border-b-0">
      <div className="h-14 px-2 flex flex-col gap-y-2.5 items-start">
        <p className="font-light opacity-60 text-xs">No.</p>
        <Badge variant="content" className="w-fit h-fit text-xs">
          #{index + 1}
        </Badge>
      </div>
      <PointsForm
        index={index}
        answerSheetId={answerSheetId}
        dataPoints={dataPoints}
      />
      <OptionsForm
        index={index}
        answerSheetId={answerSheetId}
        dataNOptions={dataNOptions}
      />
      <MultiAnswerForm
        index={index}
        answerSheetId={answerSheetId}
        answers={answers}
      />
    </div>
  );
}
