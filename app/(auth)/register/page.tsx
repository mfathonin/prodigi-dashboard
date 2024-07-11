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
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
  const registerSchema = z.object({
    email: z
      .string()
      .min(0, "Email tidak boleh kosong")
      .email("Email tidak valid"),
    password: z.string().min(0, "Password tidak boleh kosong"),
    code: z
      .string()
      .min(0, "Code tidak boleh kosong")
      .max(8, "Kode tidak valid"),
  });

  const loginForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof registerSchema>) => {
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
          <Button type="submit" className="w-full mt-4">
            Login
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <a className="anchor" href="/login">
          Masuk
        </a>
      </p>
    </>
  );
}
