import { checkAdminAccess } from "@/lib/auth-helpers";
import { query } from "@/lib/db/utils";
import { ExtendedUser } from "@/models/users";
import { unstable_cache } from "next/cache";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const getUsers = unstable_cache(
  async () => {
    const users = await query<ExtendedUser>(
      `select id, email, created_at, updated_at, last_sign_in_at from users order by created_at desc`
    );

    const roles = await query<{ id: string; role: string }>(
      `select id, role from user_roles`
    );

    return users.map((user) => ({
      ...user,
      user_roles: roles.filter((role) => role.id === user.id),
    }));
  },
  ["users"],
  { tags: ["users"] }
);

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
