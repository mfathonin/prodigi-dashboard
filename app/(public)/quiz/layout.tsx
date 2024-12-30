import { Metadata } from "next";

import { Footer } from "@/app/(protected)/components/footer";
import { TopNavbar } from "@/app/(protected)/components/top-navbar";
import { createClient } from "@/lib/supaclient/server";
import { cn } from "@/lib/utils";

const getAuthStatus = async (): Promise<boolean> => {
  const supabase = createClient();
  const { data: auth, error } = await supabase.auth.getUser();
  if (error) return false;

  return Boolean(auth.user);
};

export async function generateMetadata(): Promise<Metadata> {
  const isAuthenticated = await getAuthStatus();

  if (isAuthenticated)
    return {
      title: "Prodigi | Worksheet Management",
    };

  return {
    title: "Prodigi | Lembar Kerja",
  };
}

export default async function QuizPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await getAuthStatus();

  const bodyHeight = isAuthenticated
    ? "min-h-[calc(100dvh-70px)]"
    : "min-h-[calc(100dvh-112px)]";

  return (
    <>
      {isAuthenticated ? <TopNavbar /> : <div className="" />}
      <div
        className={cn(
          bodyHeight,
          "mx-auto py-6 z-10 bg-background sticky left-0 shadow-md ${bodyHeight}"
        )}
      >
        <div className="container px-3 md:px-6 h-full">{children}</div>
      </div>
      <Footer />
    </>
  );
}
