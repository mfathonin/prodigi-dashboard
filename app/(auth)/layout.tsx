import { ThemeToggle } from "@/components/theme-toggle";
import { FullLogo } from "@/components/ui/full-logo";
import { createClient } from "@/lib/supaclient/server";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Prodigi",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user != null) {
    // Redirect to protected page
    redirect("/");
  }

  return (
    <>
      <ThemeToggle className="fixed top-4 right-4" />
      <div className="w-full h-[100dvh] flex bg-slate-50 dark:bg-slate-900">
        <div className="w-full my-auto py-12 px-4 lg:px-8 lg:w-5/12 flex shrink-0 justify-center">
          <div className="flex flex-col gap-y-8 w-full sm:w-4/5 md:w-96 text-center">
            <FullLogo className="mx-auto w-full" height={100} width={180} />
            {children}
          </div>
        </div>
        <div className="w-0 hidden relative z-0 lg:flex lg:w-7/12">
          <div className="w-full bg-indigo-50 dark:bg-indigo-900" />
          <div className="rounded-full w-[25dvw] h-[25dvw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-400 dark:bg-indigo-500" />
          <div className="h-1/2 absolute bottom-0 w-full bg-surface-50 dark:bg-surface-900 !bg-opacity-10 backdrop-blur-2xl" />
        </div>
      </div>
    </>
  );
}
