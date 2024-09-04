import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getPlaceholderImage } from "@/lib/images";
import { createClient } from "@/lib/supaclient/server";
import Image from "next/image";
import { BannerDetail } from "./components/banner-detail";
import { EmptyBanner } from "./components/empty-banner";

export default async function BannerPage() {
  const supabase = createClient();
  const { data: bannerData, error } = await supabase.from("banner").select("*");

  if (error) {
    throw new Error(`Failed to fetch banner data: ${error.message}`);
  }

  const imageWithPlaceholder = await Promise.all(
    bannerData.map(async ({ image: src, url, uuid }) => {
      const imageWithPlaceholder = await getPlaceholderImage(src);
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
