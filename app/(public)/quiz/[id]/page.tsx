import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supaclient/server";
import { AnswerSheetRepository } from "@/repositories/answer-sheets";

import { AnswerConfigForm, GeneralSettingsForm } from "./components/forms";
import QuestionConfig from "./components/question-config";
import { getConfigByIndex } from "./handler";

export default async function QuizPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const answerSheetRepo = new AnswerSheetRepository(supabase);
  const answerSheet = await answerSheetRepo.getAnswerSheetById(params.id);

  if (!answerSheet) return notFound();

  const questions = Array(answerSheet.counts).fill(0);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* General Config */}
      <Accordion
        type="single"
        collapsible
        className="mb-6"
        defaultValue="general-settings"
      >
        <AccordionItem value="general-settings" className="border-b-0">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex flex-col w-full justify-between border-b border-gray-200 dark:border-gray-800 pb-3 me-6">
              Pengaturan Umum
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <GeneralSettingsForm
              answerSheetId={answerSheet.uuid}
              counts={answerSheet.counts}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Worksheet Config */}
      <div className="flex flex-col w-full justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <div className="flex gap-3 flex-1 justify-between font-medium">
          <p className="hidden md:block text-lg">Konfigurasi</p>
          <p className="md:max-w-sm m-auto md:m-0 flex-1 md:flex-none text-lg">
            Preview
          </p>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="hidden md:flex max-w-xl flex-col flex-grow justify-between pb-1 border-transparent">
          {questions.map((_, index) => (
            <QuestionConfig
              key={index}
              data={getConfigByIndex(index, answerSheet)}
              index={index}
            />
          ))}
        </div>
        <div className="hidden md:block lg:flex flex-col flex-1 justify-between pb-1 border-transparent">
          {questions.map((_, index) => (
            <div
              key={index}
              className="hidden lg:flex first:mt-4 last:border-b-0 lg:flex-grow border-b border-gray-200 dark:border-gray-800 mb-3 mx-4 border-dashed"
            />
          ))}
        </div>
        <AnswerConfigForm
          key={answerSheet.updated_at}
          answerSheetId={answerSheet.uuid}
          data={answerSheet}
        />
      </div>
    </div>
  );
}
