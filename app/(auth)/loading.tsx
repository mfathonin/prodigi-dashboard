import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-36">
      <Spinner>
        <span className="text-xs">Memuat halaman</span>
      </Spinner>
    </div>
  );
}
