"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supaclient/client";
import { ExtendedUser } from "@/models/users";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserActions } from "./user-actions";
import { toggleAdminRole } from "@/lib/auth-helpers";

export const columns: ColumnDef<ExtendedUser>[] = [
  {
    accessorKey: "is_admin",
    header: "Admin",
    cell: ({ row }) => {
      const user = row.original;

      return <AdminCheckbox user={user} />;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => {
      return formatDistanceToNow(new Date(row.getValue("created_at")), {
        addSuffix: true,
      });
    },
  },
  {
    accessorKey: "last_sign_in_at",
    header: "Terakhir Login",
    cell: ({ row }) => {
      const value = row.getValue("last_sign_in_at");
      return value
        ? formatDistanceToNow(new Date(value as string), { addSuffix: true })
        : "Never";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];

const AdminCheckbox = ({ user }: { user: ExtendedUser }) => {
  const supabase = createClient();

  const isAdmin =
    user.user_roles?.some((role) => role.role === "admin") || false;
  const [isAdminState, setIsAdminState] = useState(isAdmin);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        toast.error("Failed to get user", {
          description: "Failed to get user",
        });
      } else {
        setCurrentUser(data.user);
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleCheckboxChange = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await toggleAdminRole(user.id, checked);
      setIsAdminState(checked);
      toast.success(checked ? "User Menjadi Admin" : "Akses Admin Dihapus", {
        description: checked
          ? `User ${user.email} sekarang menjadi Admin`
          : `User ${user.email} tidak lagi menjadi Admin`,
      });
    } catch (error) {
      console.error("Error toggling admin role:", error);
      toast.error("Gagal Mengubah Status Admin", {
        description: "Terjadi kesalahan saat mengubah status admin",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center px-4">
      <Checkbox
        className="rounded-[6px]"
        checked={isAdminState}
        onCheckedChange={handleCheckboxChange}
        disabled={isLoading || user.id === currentUser?.id}
      />
    </div>
  );
};
