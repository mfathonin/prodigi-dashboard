import { createAdminClient } from "@/lib/supaclient/admin";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { checkAdminAccess } from "@/lib/auth-helpers";
import { ExtendedUser } from "@/models/users";

export default async function UsersPage() {
  await checkAdminAccess();

  const supabaseAdmin = createAdminClient();

  // Fetch users from Supabase
  const { data: users, error: usersError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (usersError) {
    console.error("Error fetching users:", usersError);
    return <div>Error loading users</div>;
  }

  // Fetch user roles
  const { data: userRoles, error: rolesError } = await supabaseAdmin
    .from("user_roles")
    .select("*");

  if (rolesError) {
    console.error("Error fetching user roles:", rolesError);
    return <div>Error loading user roles</div>;
  }

  // Combine user data with roles
  const usersWithRoles: ExtendedUser[] = users.users.map((user) => ({
    ...user,
    user_roles: userRoles.filter((role) => role.id === user.id),
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl">Kelola Pengguna</h1>
        <p className="text-sm text-gray-500">
          Kelola pengguna Prodigi dan akses mereka ke aplikasi.
        </p>
      </div>
      <DataTable columns={columns} data={usersWithRoles} />
    </div>
  );
}
