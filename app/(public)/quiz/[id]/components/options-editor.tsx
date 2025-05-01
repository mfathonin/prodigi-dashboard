"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { constants } from "@/lib/constants";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const {
  CONTENT: { OPTIONS_LABEL },
} = constants;

type OptionsEditorProps = {
  data: {
    nOptions: number;
    points: number;
    answer: number | number[];
  };
  index: number;
  onEdit: (value: string) => void;
};

export const OptionsEditor = ({ data, index, onEdit }: OptionsEditorProps) => {
  const { nOptions, answer } = data;

  const [answerState, setAnswerState] = useState<number | number[]>(answer);

  const defaultOptions = (className?: string) =>
    Array.from({ length: nOptions }, (_, index) => (
      <ToggleGroupItem
        className={className}
        key={index}
        value={index.toString()}
      >
        {OPTIONS_LABEL[index]}
      </ToggleGroupItem>
    ));

  const TFOptions = (className?: string) => [
    <ToggleGroupItem className={className} key={0} value="0">
      Benar
    </ToggleGroupItem>,
    <ToggleGroupItem className={className} key={1} value="1">
      Salah
    </ToggleGroupItem>,
  ];

  const options = (nOptions: number, className?: string) => {
    switch (nOptions) {
      case 2:
        return TFOptions(className);
      default:
        return defaultOptions(className);
    }
  };

  return (
    <div className="flex-1 border-b last:border-b-0 border-gray-200 dark:border-gray-800 pb-3 mb-3">
      <div className="flex justify-between items-end">
        <Label className="h-5 flex items-center">No. {index + 1}</Label>
        {Array.isArray(answer) && (
          <p className="px-1.5 h-5 flex items-center rounded-lg text-white text-xs bg-green-400/70 dark:bg-green-800/50 ">
            <i className="bx bx-info-circle me-1" /> Pilih lebih dari satu
          </p>
        )}
      </div>
      <Input
        type="hidden"
        name="answer"
        value={answerState.toString() + (Array.isArray(answer) ? "," : "")}
      />

      {Array.isArray(answerState) ? (
        <ToggleGroup
          className="flex gap-2 w-full mt-3"
          type="multiple"
          value={answerState.map((e) => e.toString())}
          onValueChange={(value) => {
            if (value.length === 0) return;
            setAnswerState(value.map((e) => parseInt(e)));
            onEdit(value.map((e) => parseInt(e)).toString());
          }}
        >
          {options(
            nOptions,
            "flex-1 data-[state=on]:bg-green-400 data-[state=on]:text-white dark:data-[state=on]:bg-green-800"
          )}
        </ToggleGroup>
      ) : (
        <ToggleGroup
          className="flex gap-2 w-full mt-3"
          type="single"
          value={answerState.toString()}
          onValueChange={(value) => {
            setAnswerState(parseInt(value));
            onEdit(value);
          }}
        >
          {options(
            nOptions,
            "flex-1 data-[state=on]:bg-green-400 data-[state=on]:text-white dark:data-[state=on]:bg-green-800"
          )}
        </ToggleGroup>
      )}
    </div>
  );
};

export const SaveButton = () => {
  const { pending } = useFormStatus();
  return (
    <div className="flex absolute h-full w-4 self-end justify-end py-2.5 z-30">
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={pending}
        className="rounded-full bg-sky-500 dark:bg-sky-900 hover:bg-sky-600 dark:hover:bg-sky-700 text-white hover:text-white sticky top-20 -translate-x-4"
      >
        <p className="text-xs text-white ms-1 me-1.5">Simpan Jawaban</p>
        <i className="bx bx-check text-xl" />
      </Button>
    </div>
  );
};
