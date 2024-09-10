"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supaclient/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ErrorWrapper } from "@/components/ui/error-wrapper";
import { User } from "@supabase/supabase-js";

const setPasswordSchema = z
  .object({
    password: z.string().min(8, "Password harus minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type SetPasswordForm = z.infer<typeof setPasswordSchema>;

export default function SetPasswordPage() {
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SetPasswordForm>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const refreshToken = urlParams.get("refresh_token");
    if (!refreshToken) {
      toast.error("Token tidak valid atau tidak ada");
      return router.push("/");
    }

    const refreshSession = async () => {
      const supabase = createClient();
      const {
        error,
        data: { user },
      } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (error) {
        setError("Gagal memperbarui sesi: " + error.message);
      }
      return user;
    };
    refreshSession()
      .then((user) => {
        if (user) {
          setUser(user);
        }
      })
      .catch((error) => {
        setError("Gagal memperbarui sesi: " + error.message);
      });
  }, [searchParams, router]);

  const onSubmit = async (values: SetPasswordForm) => {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setError("Gagal membuat password: " + error.message);
      setSuccessMessage(null);
    } else {
      setSuccessMessage("Password berhasil dibuat");
      setError(null);
      router.push("/");
    }
  };

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
                Atur password untuk akun
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
            Buat Password
          </Button>
        </form>
      </Form>
    </>
  );
}
