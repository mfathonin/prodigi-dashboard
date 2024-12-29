import { GeneralSettingsForm } from "./components/forms";

export default function NotFound({
  answerSheetId,
  bookId,
}: {
  answerSheetId?: string;
  bookId?: string;
}) {
  const isRecreateable = answerSheetId && bookId;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mt-4">
        <h1 className="text-xl">Lembar Kerja tidak ditemukan</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isRecreateable
            ? "Lembar kerja tidak ditemukan/hilang, apakah anda ingin membuatnya kembali?"
            : "Periksa kembali tautan lembar kerja yang anda gunakan"}
        </p>
      </div>
      {isRecreateable && (
        <div className="flex flex-col gap-6 w-full border border-gray-200 dark:border-gray-800 mt-4 px-6 py-4 rounded-lg">
          <h2 className="text-lg font-medium">Konfigurasi Lembar Kerja</h2>
          <GeneralSettingsForm answerSheetId={answerSheetId} bookId={bookId} />
        </div>
      )}
    </div>
  );
}
