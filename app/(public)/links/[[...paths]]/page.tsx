import Image from "next/image";
import { redirect } from "next/navigation";
import { Metadata } from "next/types";

import { BookContentsLink } from "@/models";
import { ContentsRepository } from "@/repositories/contents";
import { DownloadButton } from "@/components/ui/download-button";

import { DownloadPage } from "./components/download-page";

export const metadata: Metadata = {
  title: "Prodigi | Links",
};

export default async function LinkPage({
  params,
  searchParams,
}: {
  params: { paths: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const linkPath = params.paths?.[0];
  const appSignature = searchParams["app"];

  if (!linkPath) return <DownloadPage />;

  if (appSignature === process.env.NEXT_PUBLIC_APP_ID) {
    redirect(`/api/v1/links/${linkPath}?app=${appSignature}`);
  }
  const contentRepo = new ContentsRepository(null);

  let contentWithLink: BookContentsLink;
  try {
    contentWithLink = await contentRepo.getContentByLink(linkPath);
    if (!contentWithLink.link?.targetUrl) throw new Error("Link gagal dimuat");

    return (
      <div className="container h-svh flex flex-col gap-14 justify-center items-center">
        <Image src={"/logo.png"} alt="Prodigi Logo" width={100} height={100} />

        <div className="flex flex-col items-center gap-1">
          <p className="text-sm">Membuka konten digital</p>
          <p className="text-lg font-semibold">{contentWithLink.title}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-3">Buka dari aplikasi Prodigi!</p>
          <DownloadButton />
        </div>
      </div>
    );
  } catch (e) {
    console.error(e);
    return <DownloadPage message="Konten digital tidak ditemukan" />;
  }
}
