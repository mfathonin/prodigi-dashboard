import { ThemeToggle } from "@/components/theme-toggle";
import { FullLogo } from "@/components/ui/full-logo";
import { createClient } from "@/lib/supaclient/server";

import { ProfileMenu } from "./profile-menu";

export const TopNavbar = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (data.user == null || error) {
    throw new Error("TopNavbar only works for authenticated users");
  }

  const user = data.user;

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
