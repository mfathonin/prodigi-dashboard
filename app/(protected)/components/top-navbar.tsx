import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { FullLogo } from "@/components/ui/full-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "./profile-menu";
import { ExtendedUser } from "@/models/users";

export const TopNavbar = async () => {
  const user = await getAuthenticatedUser();

  return (
    <div className="h-[70px] flex justify-center items-center shadow-sm flex-shrink-0 sticky top-0 z-20 bg-zinc-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-slate-700 ">
      <div className="mx-auto container py-2 px-3 md:px-6 flex justify-between items-center">
        <FullLogo width={130} height={50} />
        <div className="flex gap-4 items-center">
          <ProfileMenu user={user} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
