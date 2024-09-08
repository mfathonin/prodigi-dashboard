"use server";

import { constants } from "@/lib/constants";
import { createClient } from "@/lib/supaclient/server";
import { ServerActionResult } from "@/models/results";
import { AuthError, User } from "@supabase/supabase-js";

const errors = constants.errors.auth;

export const handleSignIn = async (
  email: string,
  password: string
): Promise<ServerActionResult<User>> => {
  const supabase = createClient();

  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data: data.user, error: null };
  } catch (error) {
    return handleError(error);
  }
};

export const handleSingOut = async (): Promise<ServerActionResult<string>> => {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { data: "Logout success", error: null };
  } catch (error) {
    return handleError(error);
  }
};

export const handleResetPassword = async (
  email: string
): Promise<ServerActionResult<string>> => {
  const supabase = createClient();

  try {
    const redirectTo = `${process.env.NEXT_PUBLIC_LINKS_APP}/auth/update-password`;
    console.log(redirectTo);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;

    return { data: "Password reset email sent", error: null };
  } catch (error) {
    return handleError(error);
  }
};

export const handleUpdatePassword = async (
  newPassword: string
): Promise<ServerActionResult<string>> => {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) throw error;

    return { data: "Password updated successfully", error: null };
  } catch (error) {
    return handleError(error);
  }
};

const handleError = (error: unknown) => {
  if (error instanceof AuthError && error.status)
    return {
      data: null,
      error: {
        status: error.status,
        message: error.message ?? errors.INVALID_CREDENTIALS,
      },
    };

  return {
    data: null,
    error: {
      status: 500,
      message: errors.UNKNOWN,
    },
  };
};
