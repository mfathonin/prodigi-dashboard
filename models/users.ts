import { User } from "@supabase/supabase-js";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid")
    .min(1, "Email tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export type Login = z.infer<typeof loginSchema>;

export const loginDefaultValues: Login = {
  email: "",
  password: "",
};

export const registerSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid")
    .min(1, "Email tidak boleh kosong"),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong")
    .min(8, "Password minimal 8 karakter"),
  code: z.string().min(1, "Code tidak boleh kosong").max(8, "Kode tidak valid"),
});

export type Register = z.infer<typeof registerSchema>;

export const registerDefaultValues: Register = {
  email: "",
  password: "",
  code: "",
};

interface UserRole {
  id: string;
  role: string;
}

export interface ExtendedUser extends User {
  user_roles?: UserRole[];
}
