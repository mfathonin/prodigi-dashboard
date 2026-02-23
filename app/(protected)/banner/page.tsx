import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getPlaceholderImage } from "@/lib/images";
import { query } from "@/lib/db/utils";
import Image from "next/image";
import { BannerDetail } from "./components/banner-detail";
import { EmptyBanner } from "./components/empty-banner";

export default async function BannerPage() {
  const appBaseUrl =
    process.env.NEXT_PUBLIC_LINKS_APP ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3013");

  const bannerData = await query<{ uuid: string; image: string; url: string }>(
    `select uuid, image, url from banner`
  );

  const imageWithPlaceholder = await Promise.all(
    bannerData.map(async ({ image: src, url, uuid }) => {
      const imageWithPlaceholder = await getPlaceholderImage(
        src.startsWith("/") ? `${appBaseUrl}${src}` : src
      );
      return { ...imageWithPlaceholder, url, uuid };
    })
  );

  if (bannerData.length === 0) {
    return <EmptyBanner />;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {imageWithPlaceholder.map(({ src: image, placeholder, url, uuid }) => (
        <AspectRatio
          className="relative group rounded-md overflow-hidden"
          key={uuid}
          ratio={16 / 9}
        >
          <Image
            src={image}
            alt="image"
            fill
            placeholder="blur"
            blurDataURL={placeholder}
            sizes="100%"
            className="h-full w-full rounded-md object-cover"
          />
          <BannerDetail data={{ uuid, image, url }} />
        </AspectRatio>
      ))}
    </div>
  );
}
