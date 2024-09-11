-- Revoke permissions
revoke execute on function public.is_admin from authenticated;
revoke select on table public.user_roles from authenticated;
revoke usage on schema public from authenticated;

-- Drop RLS policies
drop policy if exists "Users can view their own role" on public.user_roles;
drop policy if exists "Only admins can insert/update/delete roles" on public.user_roles;

-- Drop is_admin function
drop function if exists public.is_admin;

-- Drop user_roles table
drop table if exists public.user_roles;