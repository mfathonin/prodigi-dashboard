-- Enable RLS on all tables
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access on link, contents, and banner
CREATE POLICY "Allow public read access on link" ON public.link FOR SELECT USING (true);
CREATE POLICY "Allow public read access on contents" ON public.contents FOR SELECT USING (true);
CREATE POLICY "Allow public read access on banner" ON public.banner FOR SELECT USING (true);

-- Create policies for authenticated users on other tables
CREATE POLICY "Allow authenticated read access on attributes" ON public.attributes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access on books" ON public.books FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access on books_attributes" ON public.books_attributes FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for authenticated users to insert, update, and delete
CREATE POLICY "Allow authenticated insert on attributes" ON public.attributes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on attributes" ON public.attributes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on attributes" ON public.attributes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on books" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on books" ON public.books FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on books" ON public.books FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on books_attributes" ON public.books_attributes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on books_attributes" ON public.books_attributes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on books_attributes" ON public.books_attributes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on contents" ON public.contents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on contents" ON public.contents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on contents" ON public.contents FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on link" ON public.link FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on link" ON public.link FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on link" ON public.link FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on banner" ON public.banner FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on banner" ON public.banner FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on banner" ON public.banner FOR DELETE USING (auth.role() = 'authenticated');

-- Update is_admin function to use empty search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
  RETURNS boolean 
  SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke unnecessary permissions from anon and authenticated roles
REVOKE ALL ON TABLE public.attributes FROM anon, authenticated;
REVOKE ALL ON TABLE public.books FROM anon, authenticated;
REVOKE ALL ON TABLE public.books_attributes FROM anon, authenticated;
REVOKE ALL ON TABLE public.contents FROM anon, authenticated;
REVOKE ALL ON TABLE public.link FROM anon, authenticated;
REVOKE ALL ON TABLE public.banner FROM anon, authenticated;

-- Grant full CRUD permissions to authenticated role for all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.attributes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.books TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.books_attributes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.link TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.banner TO authenticated;

-- Grant necessary permissions to anon role
GRANT SELECT ON TABLE public.contents TO anon;
GRANT SELECT ON TABLE public.link TO anon;
GRANT SELECT ON TABLE public.banner TO anon;