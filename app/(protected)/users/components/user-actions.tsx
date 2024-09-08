"use client";

import { handleResetPassword as resetPasswordAction } from "@/app/auth/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItems } from "@/components/ui/menu-items";
import { deleteUser } from "@/lib/auth-helpers";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type UserActionsProps = {
  user: User;
};

export const UserActions = ({ user }: UserActionsProps) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleResetPassword = async () => {
    const { error } = await resetPasswordAction(user.email!);

    if (error) {
      toast.error("Failed to send reset password email", {
        description: error.message,
      });
    } else {
      toast.success("Reset password email sent", {
        description: `An email has been sent to ${user.email}`,
      });
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleteDialogOpen(false);
    try {
      await deleteUser(user.id);
      toast.success("User deleted", {
        description: `User ${user.email} has been deleted`,
      });
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to delete user", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 rounded-full"
          >
            <span className="sr-only">Open menu</span>
            <i className="bx bx-dots-horizontal-rounded text-lg" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuGroup>
            <MenuItems
              onClick={handleResetPassword}
              label="Reset password"
              icon="bx bxs-key"
            />
            <MenuItems
              onClick={() => setIsDeleteDialogOpen(true)}
              label="Delete user"
              icon="bx bx-trash"
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah Anda yakin ingin menghapus user ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak dapat dibatalkan. Ini akan menghapus akun user
              secara permanen. <br />
              <br />
              Lanjutkan untuk menghapus {user.email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              className="rounded-full"
              size="sm"
              onClick={handleDeleteUser}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
