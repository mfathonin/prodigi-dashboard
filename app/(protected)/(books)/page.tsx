import { redirect } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";

export default function LoadingRedirectHomePage() {
  redirect("/users");

  return (
    <div className="flex justify-center items-center h-[50svh]">
      <Spinner>
        <span className="sr-only">Memuat</span>
        <span>Memuat</span>
      </Spinner>
    </div>
  );
}
