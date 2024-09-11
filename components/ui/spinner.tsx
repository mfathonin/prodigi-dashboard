import { cn } from "@/lib/utils";

export function Spinner({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full w-full">
      <i
        className={cn(
          className,
          "bx bx-loader animate-loading text-4xl text-slate-500"
        )}
      />
      {children}
    </div>
  );
}
