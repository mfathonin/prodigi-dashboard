import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Toolbar } from "./components/toolbar";
import Image from "next/image";
import { BannerDetail } from "./components/banner-detail";
import { getPlaceholderImage } from "@/lib/images";

export default async function BannerPage() {
  const bannerData = [
    {
      image:
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
      url: "https://youtube.com",
    },
    {
      image:
        "https://images.unsplash.com/photo-1566929462727-4a89889acb31??w=800&dpr=2&q=80",
      url: "https://youtube.com",
    },
    {
      image:
        "https://images.unsplash.com/photo-1547471705-236742cfac2e?w=800&dpr=2&q=80",
      url: "https://youtube.com",
    },
  ];

  const imageWithPlaceholder = await Promise.all(
    bannerData.map(async ({ image: src }) => {
      const imageWithPlaceholder = await getPlaceholderImage(src);
      return imageWithPlaceholder;
    })
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        {/* Page header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl lg:text-3xl">
            Keloka Banner Promosi
          </h1>
          <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
            Tempat mengelola konten banner promosi yang akan ditampilkan dalam
            aplikasi.
          </p>
        </div>

        {/* Toolbar: add */}
        <Toolbar />
      </div>

      {/* Banner list */}
      <div className="grid grid-cols-2 gap-6">
        {imageWithPlaceholder.map(({ src: image, placeholder }) => (
          <AspectRatio
            className="relative group rounded-md overflow-hidden"
            key={image}
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
            <BannerDetail data={{ image, url: image }} />
          </AspectRatio>
        ))}
      </div>
    </div>
  );
}
