-- First, revoke the permissions granted in the original migration
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.attributes FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.books FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.books_attributes FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.contents FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.link FROM authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.banner FROM authenticated;

REVOKE SELECT ON TABLE public.contents FROM anon;
REVOKE SELECT ON TABLE public.link FROM anon;
REVOKE SELECT ON TABLE public.banner FROM anon;

-- Then, restore the permissions that were revoked in the original migration
GRANT ALL ON TABLE public.attributes TO anon, authenticated;
GRANT ALL ON TABLE public.books TO anon, authenticated;
GRANT ALL ON TABLE public.books_attributes TO anon, authenticated;
GRANT ALL ON TABLE public.contents TO anon, authenticated;
GRANT ALL ON TABLE public.link TO anon, authenticated;
GRANT ALL ON TABLE public.banner TO anon, authenticated;

-- Drop RLS policies
DROP POLICY IF EXISTS "Allow public read access on link" ON public.link;
DROP POLICY IF EXISTS "Allow public read access on contents" ON public.contents;
DROP POLICY IF EXISTS "Allow public read access on banner" ON public.banner;

DROP POLICY IF EXISTS "Allow authenticated read access on attributes" ON public.attributes;
DROP POLICY IF EXISTS "Allow authenticated read access on books" ON public.books;
DROP POLICY IF EXISTS "Allow authenticated read access on books_attributes" ON public.books_attributes;

DROP POLICY IF EXISTS "Allow authenticated insert on attributes" ON public.attributes;
DROP POLICY IF EXISTS "Allow authenticated update on attributes" ON public.attributes;
DROP POLICY IF EXISTS "Allow authenticated delete on attributes" ON public.attributes;

DROP POLICY IF EXISTS "Allow authenticated insert on books" ON public.books;
DROP POLICY IF EXISTS "Allow authenticated update on books" ON public.books;
DROP POLICY IF EXISTS "Allow authenticated delete on books" ON public.books;

DROP POLICY IF EXISTS "Allow authenticated insert on books_attributes" ON public.books_attributes;
DROP POLICY IF EXISTS "Allow authenticated update on books_attributes" ON public.books_attributes;
DROP POLICY IF EXISTS "Allow authenticated delete on books_attributes" ON public.books_attributes;

DROP POLICY IF EXISTS "Allow authenticated insert on contents" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated update on contents" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated delete on contents" ON public.contents;

DROP POLICY IF EXISTS "Allow authenticated insert on link" ON public.link;
DROP POLICY IF EXISTS "Allow authenticated update on link" ON public.link;
DROP POLICY IF EXISTS "Allow authenticated delete on link" ON public.link;

DROP POLICY IF EXISTS "Allow authenticated insert on banner" ON public.banner;
DROP POLICY IF EXISTS "Allow authenticated update on banner" ON public.banner;
DROP POLICY IF EXISTS "Allow authenticated delete on banner" ON public.banner;

-- Disable RLS on all tables
ALTER TABLE public.attributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books_attributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.link DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner DISABLE ROW LEVEL SECURITY;

-- Revert is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;