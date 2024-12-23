import { Badge } from "@/components/ui/badge";
import { OptionsForm, PointsForm } from "./forms";

type QuestionConfigProps = {
  data: {
    id: string;
    nOptions: number;
    points: number;
  };
  index: number;
};

export default function QuestionConfig({ data, index }: QuestionConfigProps) {
  const {
    nOptions: dataNOptions,
    points: dataPoints,
    id: answerSheetId,
  } = data;

  return (
    <div className="hidden md:flex max-w-64 flex-1 flex-col justify-end items-end pb-3 mb-3 gap-1 border-b border-gray-200 dark:border-gray-800 pe-4 first:mt-4 last:border-b-0">
      <div className="flex justify-between w-full items-center">
        <Badge variant="content" className="w-fit h-fit text-xs">
          #{index + 1}
        </Badge>
        <PointsForm
          index={index}
          answerSheetId={answerSheetId}
          dataPoints={dataPoints}
        />
      </div>

      <OptionsForm
        index={index}
        answerSheetId={answerSheetId}
        dataNOptions={dataNOptions}
      />
    </div>
  );
}
