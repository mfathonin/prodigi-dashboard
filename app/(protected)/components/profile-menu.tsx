"use client";

import { handleSingOut } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";

export type ProfileMenuProps = {
  user: User;
};

export const ProfileMenu = ({ user }: ProfileMenuProps) => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    handleSingOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-4 items-center py-1 px-1 md:pl-5 rounded-full cursor-pointer group hover:bg-surface-100-800-token hover:bg-slate-100 dark:hover:bg-slate-800">
          <p className="hidden md:flex">{user.email}</p>
          <Avatar>
            <AvatarFallback className="bg-indigo-800 dark:bg-indigo-300 text-white">
              <i className="bx bxs-face text-3xl text-slate-200 dark:text-slate-700" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuGroup>
          <MenuItems
            onClick={() => handleNavigate("/")}
            label="Konten buku"
            icon="bx bxs-book-content"
          />
          <MenuItems
            onClick={() => handleNavigate("/banner")}
            label="In-app Banner"
            icon="bx bx-collection"
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
        <DropdownMenuGroup>
          <MenuItems
            onClick={() => handleNavigate("/reset-password")}
            icon="bx bxs-key"
            label="Reset password"
          />
          <MenuItems
            onClick={handleLogout}
            icon="bx bx-log-out-circle"
            label="Logout"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type MenuItemsProps = {
  icon?: string;
  className?: string;
  label: string;
  onClick?: () => void;
};

const MenuItems = ({ icon, label, className, onClick }: MenuItemsProps) => {
  return (
    <DropdownMenuItem
      className={cn(className, "flex gap-x-3 items-center justify-start")}
      onClick={onClick}
    >
      {icon && <i className={cn("text-lg", icon)} />}
      {label}
    </DropdownMenuItem>
  );
};
