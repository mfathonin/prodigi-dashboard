import { Toolbar } from "./components/toolbar";
import { BannerDialogProvider } from "./dialog-context";

export default function BannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerDialogProvider>
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          {/* Page header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl">
              Kelola Banner Promosi
            </h1>
            <p className="text-sm lg:text-base opacity-60 text-zinc-700 dark:text-zinc-200">
              Tempat mengelola konten banner promosi yang akan ditampilkan dalam
              aplikasi.
            </p>
          </div>

          {/* Toolbar: add */}
          <Toolbar />
        </div>

        <div className="flex flex-col gap-10">{children}</div>
      </div>
    </BannerDialogProvider>
  );
}
