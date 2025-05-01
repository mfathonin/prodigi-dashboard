"use client";

import { useId, useOptimistic, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AnswerSheet } from "@/models";

import {
  decreaseNOption,
  decreasePoints,
  increaseNOption,
  increasePoints,
  recreateAnswerSheet,
  updateAnswerSheet,
  updateGeneralSettings,
} from "./handler";
import { OptionsEditor, SaveButton } from "./options-editor";

export const GeneralSettingsForm = ({
  answerSheetId,
  bookId,
  counts,
}: {
  answerSheetId: string;
  bookId?: string;
  counts?: number;
}) => {
  return (
    <form
      action={bookId ? recreateAnswerSheet : updateGeneralSettings}
      className="flex flex-col gap-4 px-1 pt-2"
    >
      <p className="text-sm text-gray-500 italic">
        Atur jumlah soal, jumlah opsi, dan poin untuk setiap soal. Aksi ini akan
        mengatur ulang lembar kerja yang telah dibuat.
      </p>
      <div className="grid grid-cols-6 gap-4">
        <input type="hidden" name="answerSheetId" value={answerSheetId} />
        {bookId && <input type="hidden" name="bookId" value={bookId} />}
        <div className="flex col-span-6 sm:col-span-2 flex-col gap-1.5">
          <Label>
            Jumlah Soal <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            name="counts"
            min={1}
            defaultValue={counts}
            required
            placeholder="Jumlah Soal"
          />
        </div>
        <div className="flex col-span-3 sm:col-span-2 flex-col gap-1.5">
          <Label>
            Jumlah Opsi {!!bookId && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="number"
            name="nOptions"
            min={2}
            max={5}
            placeholder="Jumlah Opsi"
            required={bookId !== undefined}
          />
        </div>
        <div className="flex col-span-3 sm:col-span-2 flex-col gap-1.5">
          <Label>
            Points {!!bookId && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="number"
            name="points"
            min={1}
            placeholder="Points"
            required={bookId !== undefined}
          />
        </div>
      </div>

      <ResetButton />
    </form>
  );
};

const ResetButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-fit self-end bg-red-500"
      variant="destructive"
      size="sm"
      disabled={pending}
    >
      Atur Ulang
    </Button>
  );
};

const initialOptionsErrorState = { increase: false, decrease: false };

export const OptionsForm = ({
  answerSheetId,
  index,
  dataNOptions,
}: {
  answerSheetId: string;
  index: number;
  dataNOptions: number;
}) => {
  const [optimisticDataNOptions, setOptimisticDataNOptions] = useOptimistic<
    number,
    number
  >(dataNOptions, (_, value: number) => value);
  const [isError, setIsError] = useState(initialOptionsErrorState);

  const handleFormAction =
    (type: "increase" | "decrease") => async (formData: FormData) => {
      setOptimisticDataNOptions(
        optimisticDataNOptions + (type === "increase" ? 1 : -1)
      );
      setIsError(initialOptionsErrorState);
      try {
        if (type === "increase") await increaseNOption(formData);
        else await decreaseNOption(formData);
      } catch (error) {
        setOptimisticDataNOptions(
          optimisticDataNOptions - (type === "increase" ? 1 : -1)
        );
        setIsError({
          ...initialOptionsErrorState,
          [type]: true,
        });
        toast.error(`Terjadi kesalahan`, {
          description: `[options.${type}.${index}]: ${
            (error as Error).message
          }`,
        });
      }
    };

  return (
    <div className="flex flex-col items-start gap-y-2 w-32">
      <Label className="text-xs font-light opacity-60 px-2">Jumlah Opsi</Label>
      <div className="flex items-center gap-2">
        <form action={handleFormAction("decrease")}>
          <input type="hidden" name="answerSheetId" value={answerSheetId} />
          <input type="hidden" name="index" value={index} />
          <ButtonPlusMinus
            type="minus"
            value={optimisticDataNOptions}
            range={{ min: 2, max: 5 }}
          />
        </form>
        <span
          className={cn(
            "border-b border-gray-200 dark:border-gray-800 py-1 mb-1 px-2.5 text-sm min-w-10 text-center",
            (isError.decrease || isError.increase) &&
              "bg-red-500/10 text-red-500 border-red-500"
          )}
        >
          {optimisticDataNOptions}
        </span>
        <form action={handleFormAction("increase")}>
          <input type="hidden" name="answerSheetId" value={answerSheetId} />
          <input type="hidden" name="index" value={index} />
          <ButtonPlusMinus
            type="plus"
            value={optimisticDataNOptions}
            range={{ min: 2, max: 5 }}
            isError={isError?.increase}
          />
        </form>
      </div>
    </div>
  );
};

const initialPointsErrorState = { decrease: false, increase: false };
export const PointsForm = ({
  answerSheetId,
  index,
  dataPoints,
}: {
  answerSheetId: string;
  index: number;
  dataPoints: number;
}) => {
  const [isError, setIsError] = useState(initialPointsErrorState);
  const [optimisticDataPoints, setOptimisticDataPoints] = useOptimistic<
    number,
    number
  >(dataPoints, (_, value: number) => value);

  const handleFormAction =
    (type: "increase" | "decrease") => async (formData: FormData) => {
      setOptimisticDataPoints(
        optimisticDataPoints + (type === "increase" ? 1 : -1)
      );
      setIsError(initialPointsErrorState);
      try {
        if (type === "increase") await increasePoints(formData);
        else await decreasePoints(formData);
      } catch (error) {
        setOptimisticDataPoints(
          optimisticDataPoints - (type === "increase" ? 1 : -1)
        );
        setIsError({ ...initialPointsErrorState, [type]: true });
        toast.error("Terjadi kesalahan", {
          description: `[points.${type}.${index}]: ${(error as Error).message}`,
        });
      }
    };
  return (
    <div className="flex flex-col items-start gap-y-2 w-32">
      <Label className="text-xs font-light opacity-60 px-2">Points</Label>
      <div className="flex items-center gap-2">
        <form action={handleFormAction("decrease")}>
          <input type="hidden" name="answerSheetId" value={answerSheetId} />
          <input type="hidden" name="index" value={index} />
          <ButtonPlusMinus
            type="minus"
            value={optimisticDataPoints}
            range={{ min: 1 }}
            isError={isError?.decrease}
          />
        </form>
        <span
          className={cn(
            "border-b border-gray-200 dark:border-gray-800 py-1 mb-1 px-2.5 text-sm min-w-10 text-center",
            (isError.decrease || isError.increase) &&
              "bg-red-500/10 text-red-500 border-red-500"
          )}
        >
          {optimisticDataPoints}
        </span>
        <form action={handleFormAction("increase")}>
          <input type="hidden" name="answerSheetId" value={answerSheetId} />
          <input type="hidden" name="index" value={index} />
          <ButtonPlusMinus
            type="plus"
            value={optimisticDataPoints}
            range={{ min: 1 }}
            isError={isError?.increase}
          />
        </form>
      </div>
    </div>
  );
};

export const MultiAnswerForm = ({
  answerSheetId,
  index,
  answers: currentAnswers,
}: {
  answerSheetId: string;
  index: number;
  answers: (number | number[])[];
}) => {
  const [isCheckedOptimistic, setIsCheckedOptimistic] = useOptimistic<
    boolean,
    boolean
  >(Array.isArray(currentAnswers[index]), (_, value: boolean) => value);

  const handleToggleMultiAnswer = async (formData: FormData) => {
    try {
      setIsCheckedOptimistic(!isCheckedOptimistic);
      const newAnswer = Array.isArray(currentAnswers[index])
        ? 0
        : [currentAnswers[index]];
      const newAnswersArray = [
        ...currentAnswers.slice(0, index),
        newAnswer,
        ...currentAnswers.slice(index + 1),
      ];
      formData.set("answers", JSON.stringify(newAnswersArray));

      await updateAnswerSheet(formData);
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: `[multi-answer.${index}]: ${(error as Error).message}`,
      });
      setIsCheckedOptimistic(!isCheckedOptimistic);
    }
  };

  return (
    <form action={handleToggleMultiAnswer}>
      <input type="hidden" name="answerSheetId" value={answerSheetId} />
      <input type="hidden" name="counts" value={currentAnswers.length} />
      <div className="flex flex-1 flex-col gap-y-2">
        <p className="font-light opacity-60 text-xs">Multi Jawaban</p>
        <ToggleMultiAnswer state={isCheckedOptimistic} />
      </div>
    </form>
  );
};

const ToggleMultiAnswer = ({ state }: { state: boolean }) => {
  const { pending } = useFormStatus();
  const uid = useId();

  return (
    <div className="h-8 flex justify-start items-center gap-x-1">
      <Switch
        id={`multi-answer-${uid}`}
        type="submit"
        disabled={pending}
        checked={state}
      />
      {pending && (
        <div className="size-6">
          <Spinner className="mx-2 !text-lg" />
        </div>
      )}
    </div>
  );
};

const ButtonPlusMinus = ({
  type,
  value,
  range,
  isError,
}: {
  type: "plus" | "minus";
  value: number;
  range?: { min?: number; max?: number };
  isError?: boolean;
}) => {
  const onMinMax =
    range &&
    ((range.min !== undefined && value === range.min && type === "minus") ||
      (range.max !== undefined && value === range.max && type === "plus"));

  const errorStyle = "bg-red-500/10 text-red-500";
  const normalStyle =
    type === "plus"
      ? "text-green-500 hover:bg-green-500/10 hover:text-green-500"
      : "text-red-500 hover:bg-red-500/10 hover:text-red-500";

  return (
    <Button
      size="icon-sm"
      className={cn("rounded-full", isError ? errorStyle : normalStyle)}
      variant="ghost"
      disabled={onMinMax}
    >
      <i className={`bx bx-${type} text-lg`} />
    </Button>
  );
};

export const AnswerConfigForm = ({
  answerSheetId,
  data,
}: {
  answerSheetId: string;
  data: AnswerSheet;
}) => {
  const [edited, setEdited] = useState(false);
  const [isError, setIsError] = useState(false);
  if (!data) return null;

  const counts = data.counts;
  const questions = Array.from({ length: counts }, (_, index) => index);
  const getData = (index: number) => ({
    id: answerSheetId,
    nOptions: data.n_options[index] ?? 0,
    points: data.points[index] ?? 0,
    answer: (data.answers as (number | number[])[])[index] ?? 0,
  });

  return (
    <form
      action={async (formData) => {
        try {
          setIsError(false);
          setEdited(false);
          await updateAnswerSheet(formData);
          toast.success("Berhasil menyimpan perubahan", {
            description: "Konfigurasi jawaban berhasil diperbarui",
          });
        } catch (error) {
          toast.error("Terjadi kesalahan", {
            description: `[answerConfig]: ${(error as Error).message}`,
          });
          setIsError(true);
        }
      }}
      className="relative flex flex-col max-w-sm min-w-max flex-shrink-0 m-auto md:m-0 flex-grow z-20"
    >
      <input type="hidden" name="answerSheetId" value={answerSheetId} />
      <input type="hidden" name="counts" value={counts} />
      <div
        className={cn(
          "flex flex-col flex-1 justify-between border border-gray-200 dark:border-gray-800 rounded-lg pt-4 pb-1 px-4",
          edited && "border-orange-500 dark:border-orange-400 border-dashed"
        )}
      >
        {questions.map((_, index) => (
          <OptionsEditor
            key={index}
            data={getData(index)}
            index={index}
            onEdit={(_) => setEdited(true)}
          />
        ))}
      </div>
      {edited && <SaveButton />}
    </form>
  );
};
