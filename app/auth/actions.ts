"use server";

import { constants } from "@/lib/constants";
import {
  requestPasswordReset,
  signInWithPassword,
  signOut,
  updatePasswordForCurrentUser,
} from "@/lib/auth/service";
import { ServerActionResult } from "@/models/results";
import { AppUser } from "@/lib/auth/types";
import { sendPasswordResetEmail } from "@/lib/email";
import { getServerAppBaseUrl } from "@/lib/url";

const errors = constants.errors.auth;

export const handleSignIn = async (
  email: string,
  password: string
): Promise<ServerActionResult<AppUser>> => {

  try {
    const { error, user } = await signInWithPassword(email, password);

    if (error) throw error;

    return { data: user, error: null };
  } catch (error) {
    return handleError(error);
  }
};

export const handleSingOut = async (): Promise<ServerActionResult<string>> => {
  try {
    const { error } = await signOut();

    if (error) throw error;

    return { data: "Logout success", error: null };
  } catch (error) {
    return handleError(error);
  }
};

export const handleResetPassword = async (
  email: string
): Promise<ServerActionResult<string>> => {
  try {
    const { token } = await requestPasswordReset(email);
    if (!token) return { data: "If account exists, reset is available", error: null };

    const resetUrl = `${getServerAppBaseUrl()}/auth/update-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl);
    console.info("Password reset email sent", { email });
    return { data: "If account exists, reset is available", error: null };
  } catch (error) {
    return handleError(error);
  }
};

export const handleUpdatePassword = async (
  newPassword: string
): Promise<ServerActionResult<string>> => {
  try {
    await updatePasswordForCurrentUser(newPassword);

    return { data: "Password updated successfully", error: null };
  } catch (error) {
    return handleError(error);
  }
};

const handleError = (error: unknown) => {
  if (error instanceof Error)
    return { data: null, error: { status: 401, message: error.message } };

  return {
    data: null,
    error: {
      status: 500,
      message: errors.UNKNOWN,
    },
  };
};
