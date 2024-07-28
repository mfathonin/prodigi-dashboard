import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <Spinner>
      <p className="text-sm opacity-60">Memuat konten buku</p>
    </Spinner>
  );
}
