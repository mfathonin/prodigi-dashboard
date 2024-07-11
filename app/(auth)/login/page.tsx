"use client";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "Email tidak boleh kosong")
      .email("Email tidak valid"),
    password: z.string().min(1, "Password tidak boleh kosong"),
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
  };

  return (
    <>
      {/* Error message when user provide wrong auth details */}
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
      <p className="text-center text-sm text-gray-500">
        Belum punya akun?{" "}
        <Link href="/register" className="underline">
          Daftar disini
        </Link>
      </p>
    </>
  );
}
