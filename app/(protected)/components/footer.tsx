import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="z-0 sticky bottom-0 md:flex py-2 bg-zinc-100 dark:bg-zinc-800">
      <div className="container mx-auto px-3 md:px-6 flex justify-between items-end py-5">
        <small className="text-slate-500 dark:text-slate-400">
          <p className="text-xs">Copyright © 2023</p>
          <p className="text-sm font-medium">PT Merah Putih Perkasa</p>
        </small>
        <div className="flex flex-col justify-end items-end">
          <Image
            src={"/logo.png"}
            className="dark:invert"
            alt="Prodigi Logo"
            width={56}
            height={56}
          />
        </div>
      </div>
    </footer>
  );
};
