import { DialogProvider } from "../dialog/provider";
import BookList from "./components/book-list";
import { Toolbar } from "./components/toolbar";

export default function Page({
  params,
  searchParams,
}: {
  params: { bookId: string };
  searchParams: Record<string, string>;
}) {
  console.log(1349, "@list/page", { params, searchParams });

  return (
    <DialogProvider>
      <Toolbar />

      <BookList params={params} searchParams={searchParams} />
    </DialogProvider>
  );
}
