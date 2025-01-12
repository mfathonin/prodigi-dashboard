CREATE Extension IF NOT EXISTS "wrappers"
WITH SCHEMA "extensions";

-- Alter the RLS for SELECT on books
DROP POLICY "Allow authenticated read access on books" ON "public"."books";

CREATE POLICY "Enable read access for all users" ON "public"."books" AS Permissive FOR
SELECT
  TO public USING (true);

-- Grant SELECT on books for anon
GRANT SELECT ON TABLE "public"."books" TO "anon";
