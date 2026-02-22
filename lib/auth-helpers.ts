"use server";

import {
  consumeInviteToken,
  currentUserWithRoles,
  deleteUserById,
  inviteUserByEmail,
  isAdmin,
} from "@/lib/auth/service";
import { ExtendedUser } from "@/models/users";
import { revalidatePath } from "next/cache";
import { sendInviteEmail } from "@/lib/email";
import { getServerAppBaseUrl } from "@/lib/url";
import { redirect } from "next/navigation";
import { execute } from "./db/utils";

export async function getAuthenticatedUser(): Promise<ExtendedUser> {
  const user = await currentUserWithRoles();
  if (!user) redirect("/auth/login");
  return user;
}

export async function redirectIfAuthenticated() {
  const user = await currentUserWithRoles();
  if (user) redirect("/books");
}

export async function redirectIfUnauthenticated() {
  const user = await currentUserWithRoles();
  if (!user) redirect("/auth/login");
}

export async function checkAdminAccess() {
  const user = await getAuthenticatedUser();
  const allowed = await isAdmin(user.id);
  if (!allowed) redirect("/auth/unauthorized");
}

export async function deleteUser(userId: string) {
  await deleteUserById(userId);
  revalidatePath("/users");
}

export async function inviteUser(email: string) {
  const data = await inviteUserByEmail(email);
  const inviteUrl = `${getServerAppBaseUrl()}/auth/set-password?token=${data.token}`;
  await sendInviteEmail(email, inviteUrl);
  revalidatePath("/users");
  return { ...data, inviteUrl };
}

export async function toggleAdminRole(userId: string, isAdminRole: boolean) {
  if (isAdminRole) {
    await execute(
      `insert into user_roles (id, role, created_at) values (?, 'admin', ?)
       on conflict(id) do update set role='admin'`,
      [userId, new Date().toISOString()]
    );
  } else {
    await execute(`delete from user_roles where id = ?`, [userId]);
  }

  revalidatePath("/users");
}

export async function acceptInvite(token: string, password: string) {
  await consumeInviteToken(token, password);
}
