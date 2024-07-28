import { createClient } from "@/lib/supaclient/server";

import { redirect } from "next/navigation";

import { Footer } from "./components/footer";
import { TopNavbar } from "./components/top-navbar";

export default async function ProtectedPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (data.user == null || error) {
    redirect("/login");
  }

  return (
    <>
      <TopNavbar />
      <div className="mx-auto py-6 z-10 bg-background sticky left-0 shadow-md min-h-[calc(100dvh-70px)]">
        <div className="container px-3 md:px-6 h-full">{children}</div>
      </div>
      <Footer />
    </>
  );
}
