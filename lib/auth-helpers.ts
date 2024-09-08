"use server";

import { createClient } from "@/lib/supaclient/server";
import { ExtendedUser } from "@/models/users";
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
    redirect("/unauthorized");
  }
}

export async function deleteUser(userId: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw error;
  }
}
