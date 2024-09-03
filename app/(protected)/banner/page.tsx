import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Toolbar } from "./components/toolbar";
import Image from "next/image";
import { BannerDetail } from "./components/banner-detail";

export default function BannerPage() {
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
        {[1, 2, 3].map((item) => (
          <AspectRatio
            className="relative group rounded-md overflow-hidden"
            key={item}
            ratio={16 / 9}
          >
            <Image
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="image"
              fill
              className="h-full w-full rounded-md object-cover"
            />
            <BannerDetail />
          </AspectRatio>
        ))}
      </div>
    </div>
  );
}
