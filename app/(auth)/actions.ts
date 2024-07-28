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

const handleError = (error: unknown) => {
  if (error instanceof AuthError && error.status)
    return {
      data: null,
      error: {
        status: error.status,
        message: errors.INVALID_CREDENTIALS,
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
