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
import {
  type Register,
  registerDefaultValues,
  registerSchema,
} from "@/models/users";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterForm() {
  const [errorMessages, setErrorMessages] = useState<string>();

  const loginForm = useForm<Register>({
    resolver: zodResolver(registerSchema),
    reValidateMode: "onBlur",
    defaultValues: registerDefaultValues,
  });

  const onRegisterSubmit = (values: Register) => {
    console.log(values);
  };

  return (
    <>
      {/* Error message when user provide wrong auth details */}
      {errorMessages && (
        <ErrorWrapper>
          <p>{errorMessages}</p>
        </ErrorWrapper>
      )}

      {/* Register form */}
      <Form {...loginForm}>
        <form
          className="w-auto text-start flex flex-col gap-y-3"
          onSubmit={loginForm.handleSubmit(onRegisterSubmit)}
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
          <FormField
            control={loginForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Masukan kode Anda" {...field} />
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
            Daftar
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <Link className="underline" href="/login">
          Masuk
        </Link>
      </p>
    </>
  );
}
