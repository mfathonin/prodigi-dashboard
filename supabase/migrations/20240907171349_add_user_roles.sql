-- Create user_roles table
create table public.user_roles (
  id uuid references auth.users not null primary key,
  role text not null check (role in ('admin', 'user')),
  created_at timestamp with time zone default now()
);

-- Create is_admin function
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from public.user_roles
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Set up RLS policies for user_roles
alter table public.user_roles enable row level security;

create policy "Users can view their own role"
  on public.user_roles for select
  using (auth.uid() = id);

create policy "Only admins can insert/update/delete roles"
  on public.user_roles for all
  using (is_admin(auth.uid()));

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant select on table public.user_roles to authenticated;
grant execute on function public.is_admin to authenticated;