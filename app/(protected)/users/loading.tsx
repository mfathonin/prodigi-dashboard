import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[50svh]">
      <Spinner>
        <span className="sr-only">Memuat data user</span>
        <span>Memuat data user</span>
      </Spinner>
    </div>
  );
}
