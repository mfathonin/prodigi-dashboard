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
import { type Login, loginDefaultValues, loginSchema } from "@/models/users";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { handleSignIn } from "../actions";

export default function LoginForm() {
  const [errorMessage, setError] = useState<string | null>(null);

  const loginForm = useForm<Login>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onChange",
    defaultValues: loginDefaultValues,
  });

  const onLoginSubmit = async (values: Login) => {
    const { data, error } = await handleSignIn(values.email, values.password);

    if (error) {
      setError(error.message);
      return;
    }
  };

  return (
    <>
      {/* Error message when user provide wrong auth details */}
      {errorMessage && (
        <ErrorWrapper>
          <p>{errorMessage}</p>
        </ErrorWrapper>
      )}

      {/* Login form */}
      <Form {...loginForm}>
        <form
          className="w-auto text-start flex flex-col gap-y-3"
          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Masukan email Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Masukan password Anda"
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
            disabled={!loginForm.formState.isValid}
          >
            Masuk
          </Button>
        </form>
      </Form>
      <div className="flex flex-col gap-1 text-center text-gray-500 text-xs -mt-4">
        <p>
          Belum punya akun?{" "}
          <Link href="/register" className="underline">
            Daftar disini
          </Link>
        </p>
        {/* <p>
          Lupa password?{" "}
          <Link href="/reset-password" className="underline">
            Reset disini
          </Link>
        </p> */}
      </div>
    </>
  );
}
