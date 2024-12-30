-- Revoke SELECT on books for anon
REVOKE SELECT ON TABLE public.books FROM anon;

-- Rollback the RLS for SELECT on books
DROP POLICY "Enable read access for all users" ON "public"."books";

CREATE POLICY "Allow authenticated read access on books" ON public.books FOR SELECT USING (auth.role() = 'authenticated');

DROP EXTENSION IF EXISTS "wrappers";
