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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleResetPassword } from "../actions";
import { useRouter } from "next/dist/client/components/navigation";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    const { data, error } = await handleResetPassword(values.email);

    if (error) {
      setError(error.message);
      setSuccessMessage(null);
      router.push("/");
    } else {
      setSuccessMessage("Password reset email sent. Please check your inbox.");
      setError(null);
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-4">
            Reset Password
          </Button>
        </form>
      </Form>
    </>
  );
}
