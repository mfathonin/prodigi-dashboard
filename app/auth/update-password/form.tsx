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
import { createClient } from "@/lib/supaclient/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function UpdatePasswordForm() {
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const form = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: UpdatePasswordForm) => {
    const { error: updateError } = await handleUpdatePassword(values.password);

    if (updateError) {
      setError(updateError?.message ?? "Unknown error");
      setSuccessMessage(null);
    } else {
      setSuccessMessage("Password updated successfully.");
      setError(null);
      router.push("/");
    }
  };

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // get auth session and refresh token from cookies in client component
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("sb-access-token="))
          ?.split("=")[1];
        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("sb-refresh-token="))
          ?.split("=")[1];
        if (accessToken && refreshToken) {
          const {
            data: { user },
            error: newSessionError,
          } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (user) {
            return setUser(user);
          }

          if (newSessionError) {
            console.log(newSessionError);
            setError("Gagal memperbarui sesi: " + newSessionError.message);
          }
        } else {
          setError("Gagal memperbarui sesi: tidak ada valid token");
        }
      } else {
        setUser(user);
      }
    };
    init();
  }, []);

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
          {user && (
            <div className="flex flex-col gap-y-1 mb-4">
              <p className="w-full text-center text-opacity-40 text-sm">
                Update password untuk akun
              </p>
              <p className="text-center font-thin text-opacity-40 text-sm">
                {user.email}
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
          <Button type="submit" className="w-full mt-4" disabled={!user}>
            Ubah Password
          </Button>
        </form>
      </Form>
    </>
  );
}
