"use server";

import { createClient } from "@/lib/supaclient/server";
import { ExtendedUser } from "@/models/users";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "./supaclient/admin";

export async function getAuthenticatedUser(): Promise<ExtendedUser> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (data.user == null || error) {
    throw new Error("User is not authenticated");
  }

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("*")
    .eq("id", data.user.id);

  if (roleError) {
    throw new Error("Error fetching user roles");
  }

  return {
    ...data.user,
    user_roles: role ?? [],
  };
}

export async function redirectIfAuthenticated() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user != null) {
    redirect("/");
  }
}

export async function redirectIfUnauthenticated() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user == null) {
    redirect("/auth/login");
  }
}

export async function checkAdminAccess() {
  const user = await getAuthenticatedUser();
  const supabase = createClient();

  const { data, error } = await supabase.rpc("is_admin", {
    user_id: user.id,
  });

  if (error || !data) {
    redirect("/auth/unauthorized");
  }
}

export async function deleteUser(userId: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw error;
  }
  revalidatePath("/users");
}

export async function inviteUser(email: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_LINKS_APP}/auth/set-password`,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/users");
  return data;
}

export async function toggleAdminRole(userId: string, isAdmin: boolean) {
  const supabase = createClient();

  if (isAdmin) {
    // Add admin role
    const { error } = await supabase
      .from("user_roles")
      .insert({ id: userId, role: "admin" });

    if (error) {
      throw new Error("Failed to add admin role");
    }
  } else {
    // Remove admin role
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .match({ id: userId });

    if (error) {
      throw new Error("Failed to remove admin role");
    }
  }

  revalidatePath("/users");
}
