import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-36">
      <Spinner>
        <span className="sr-only">Memuat</span>
        <span className="text-xs">Memuat</span>
      </Spinner>
    </div>
  );
}
