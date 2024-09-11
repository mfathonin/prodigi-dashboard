import { checkAdminAccess } from "@/lib/auth-helpers";
import { createAdminClient } from "@/lib/supaclient/admin";
import { ExtendedUser } from "@/models/users";
import { unstable_cache } from "next/cache";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const getUsers = unstable_cache(async () => {
  const supabaseAdmin = createAdminClient();

  // Fetch users from Supabase
  const { data: users, error: usersError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (usersError) {
    console.error("Error fetching users:", usersError);
    throw usersError;
  }

  // Fetch user roles
  const { data: userRoles, error: rolesError } = await supabaseAdmin
    .from("user_roles")
    .select("*");

  if (rolesError) {
    console.error("Error fetching user roles:", rolesError);
    throw rolesError;
  }

  // Combine user data with roles
  const usersWithRoles: ExtendedUser[] = users.users.map((user) => ({
    ...user,
    user_roles: userRoles.filter((role) => role.id === user.id),
  }));

  return usersWithRoles;
});

export default async function UsersPage() {
  await checkAdminAccess();

  let usersWithRoles: ExtendedUser[] = [];
  try {
    usersWithRoles = await getUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Error loading users</div>;
  }

  return <DataTable columns={columns} data={usersWithRoles} />;
}
