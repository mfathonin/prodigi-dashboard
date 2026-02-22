"use client";

import { Button } from "@/components/ui/button";
import { ErrorWrapper } from "@/components/ui/error-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleUpdatePassword } from "../actions";

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

type UpdatePasswordFormProps = {
  initialToken?: string | null;
};

export default function UpdatePasswordForm({ initialToken = null }: UpdatePasswordFormProps) {
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(
    () =>
      initialToken ??
      searchParams.get("token") ??
      searchParams.get("token_hash") ??
      searchParams.get("code"),
    [initialToken, searchParams]
  );
  const isTokenMode = Boolean(token);

  const form = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: UpdatePasswordForm) => {
    if (isTokenMode) {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Invalid reset token");
        setSuccessMessage(null);
        return;
      }

      setSuccessMessage("Password updated successfully.");
      setError(null);
      router.push("/books");
      return;
    }

    const { error: updateError } = await handleUpdatePassword(values.password);

    if (updateError) {
      setError(updateError?.message ?? "Unknown error");
      setSuccessMessage(null);
    } else {
      setSuccessMessage("Password updated successfully.");
      setError(null);
      router.push("/books");
    }
  };

  useEffect(() => {
    if (isTokenMode) {
      setUserEmail("Password reset via email link");
      return;
    }

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          setError("Gagal memperbarui sesi: tidak ada valid token");
        } else {
          setUserEmail(data.user.email);
        }
      })
      .catch(() => setError("Gagal memperbarui sesi"));
  }, [isTokenMode]);

  return (
    <>
      {errorMessage && (
        <ErrorWrapper>
          <p>{errorMessage}</p>
        </ErrorWrapper>
      )}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-auto text-start flex flex-col gap-y-3"
        >
          {userEmail && (
            <div className="flex flex-col gap-y-1 mb-4">
              <p className="w-full text-center text-opacity-40 text-sm">
                Update password untuk akun
              </p>
              <p className="text-center font-thin text-opacity-40 text-sm">
                {userEmail}
              </p>
            </div>
          )}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Baru</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Masukan password baru"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password Baru</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Konfirmasi password baru"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!isTokenMode && !userEmail}
          >
            Ubah Password
          </Button>
        </form>
      </Form>
    </>
  );
}
