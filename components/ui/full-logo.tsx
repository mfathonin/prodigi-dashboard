import { cn } from "@/lib/utils";
import Image from "next/image";

export type FullLogoProps = {
  height: number;
  width: number;
  className?: string;
};

export const FullLogo = ({ height, width, className }: FullLogoProps) => {
  return (
    <div
      className={cn(className, "relative")}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Image
        className={"dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"}
        src="/logo-long.png"
        alt="logo prodigi full"
        priority
        fill
        sizes="30vw"
        style={{ objectFit: "contain", objectPosition: "left" }}
      />
    </div>
  );
};
