import { createClient } from "@/lib/supaclient/server";
import { AttributesRepository } from "@/repositories/attributes";

export const AttributesList = async ({ bookId }: { bookId: string }) => {
  const supabase = createClient();
  const attributeRepo = new AttributesRepository(supabase);
  const attributes = await attributeRepo.getBookAttributes(bookId);

  return (
    <>
      {attributes.length > 0 && (
        <div className="table-container mt-4 w-full text-xs">
          <table className="table !bg-transparent border-transparent w-full">
            <tbody>
              {attributes.map((attr) => (
                <tr
                  key={attr.uuid}
                  className="table-row !border-transparent !bg-transparent"
                >
                  <td className="table-cell !py-1 !px-0 w-1/2 md:w-1/5 lg:w-2/12 text-slate-700 dark:text-slate-200 opacity-70">
                    {attr.key}
                  </td>
                  <td className="table-cell !py-1">
                    <span className="font-medium">{attr.value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export const AttributesLoading = () => {
  return (
    <div className="table-container mt-4 w-full text-xs">
      <table className="table !bg-transparent border-transparent w-full">
        <tbody>
          {Array.from({ length: 3 }).map((_, i) => (
            <tr
              key={i}
              className="table-row !border-transparent !bg-transparent"
            >
              <td className="table-cell !py-1 !px-0 w-1/2 md:w-1/5 lg:w-2/12 text-slate-700 dark:text-slate-200 opacity-70">
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-sm" />
              </td>
              <td className="table-cell !py-1">
                <div className="w-40 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
