export type AppUser = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string | null;
};

export type SessionUser = AppUser & {
  user_roles?: { id: string; role: string }[];
};
