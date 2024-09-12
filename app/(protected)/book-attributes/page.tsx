import { createClient } from "@/lib/supaclient/server";
import { AttributesRepository } from "@/repositories/attributes";
import { AttributeForm } from "./components/attribute-form";
import { DeleteButton } from "./components/delete-button";

export default async function BookAttributesPage() {
  const supabase = createClient();
  const attributesRepo = new AttributesRepository(supabase);
  const attributes = await attributesRepo.getAttributes();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl">Kelola Atribut Buku</h1>
        <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
          Tempat mengelola atribut buku yang kita miliki.
        </p>
      </div>
      <div className="flex flex-col flex-grow gap-6 mt-10 md:mt-[52px]">
        <AttributeForm />
        {/* Empty State */}
        {Object.keys(attributes).length === 0 && (
          <div className="text-center italic text-zinc-500 dark:text-zinc-400 h-32 w-full flex flex-col items-center justify-center">
            Belum ada atribut buku yang ditambahkan.
            <p className="text-sm">
              Tambahkan atribut untuk membantu kita mengelola buku-buku kita.
            </p>
          </div>
        )}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {/* Render Each Key Group */}
          {Object.entries(attributes).map(([key, values]) => (
            <div
              key={key}
              className="rounded-md border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-fit mb-4 break-inside-avoid"
            >
              <h2 className="text-base font-semibold border-b-2 border-slate-200 dark:border-slate-700 px-4 py-2 bg-slate-100 dark:bg-slate-800">
                {key}
              </h2>
              <ul className="space-y-2 px-4 pb-4 pt-3">
                {values.map((attr) => (
                  <li key={attr.uuid} className="flex items-center gap-3">
                    <DeleteButton uuid={attr.uuid} />
                    <span className="font-light text-sm break-words flex-grow">
                      {attr.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
