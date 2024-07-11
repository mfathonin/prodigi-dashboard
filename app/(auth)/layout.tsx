import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prodigi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "container")}>
        <div className="w-full h-[100dvh] flex">
          <div className="w-full my-auto py-12 px-4 lg:px-8 lg:w-5/12 flex shrink-0 justify-center">
            <div className="space-y-8 w-full sm:w-4/5 md:w-96 text-center">
              <Image
                className="mx-auto mb-16"
                src="/logo-long.png"
                alt="logo prodigi full"
                height={120}
                width={200}
              />
              {children}
            </div>
          </div>
          <div className="w-0 hidden relative z-0 lg:flex lg:w-7/12">
            <div className="w-full bg-primary-50-900-token" />
            <div className="rounded-full w-[25dvw] h-[25dvw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-400-500-token" />
            <div className="h-1/2 absolute bottom-0 w-full bg-surface-50 dark:bg-surface-900 !bg-opacity-10 backdrop-blur-2xl" />
          </div>
        </div>
      </body>
    </html>
  );
}
