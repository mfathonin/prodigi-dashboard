-- Revert triggers
DROP TRIGGER IF EXISTS handle_contents_updated_at ON public.contents;
DROP TRIGGER IF EXISTS handle_books_updated_at ON public.books;

-- Revert constraints and indexes
ALTER TABLE IF EXISTS "public"."contents" DROP CONSTRAINT IF EXISTS "public_contents_link_id_fkey";
ALTER TABLE IF EXISTS "public"."contents" DROP CONSTRAINT IF EXISTS "public_contents_book_id_fkey";
ALTER TABLE IF EXISTS "public"."books_attributes" DROP CONSTRAINT IF EXISTS "public_books_attributes_book_id_fkey";
ALTER TABLE IF EXISTS "public"."books_attributes" DROP CONSTRAINT IF EXISTS "public_books_attributes_attribute_id_fkey";

ALTER TABLE IF EXISTS "public"."link" DROP CONSTRAINT IF EXISTS "link_uuid_key";
ALTER TABLE IF EXISTS "public"."contents" DROP CONSTRAINT IF EXISTS "contents_uuid_key";
ALTER TABLE IF EXISTS "public"."books" DROP CONSTRAINT IF EXISTS "books_uuid_key";
ALTER TABLE IF EXISTS "public"."attributes" DROP CONSTRAINT IF EXISTS "attributes_uuid_key";

DROP INDEX IF EXISTS "public"."link_uuid_key";
DROP INDEX IF EXISTS "public"."contents_uuid_key";
DROP INDEX IF EXISTS "public"."books_uuid_key";
DROP INDEX IF EXISTS "public"."books_attributes_book_id_attribute_id_idx";
DROP INDEX IF EXISTS "public"."attributes_uuid_key";
DROP INDEX IF EXISTS "public"."attributes_key_value_idx";

-- Revert column changes
ALTER TABLE IF EXISTS "public"."link" 
  ALTER COLUMN "uuid" DROP DEFAULT,
  ALTER COLUMN "uuid" DROP NOT NULL,
  ALTER COLUMN "uuid" TYPE text,
  ALTER COLUMN "target_url" DROP NOT NULL,
  ALTER COLUMN "path" DROP NOT NULL;

ALTER TABLE IF EXISTS "public"."contents" 
  ALTER COLUMN "uuid" DROP DEFAULT,
  ALTER COLUMN "uuid" DROP NOT NULL,
  ALTER COLUMN "uuid" TYPE text,
  ALTER COLUMN "updated_at" DROP DEFAULT,
  ALTER COLUMN "updated_at" DROP NOT NULL,
  ALTER COLUMN "updated_at" TYPE text,
  ALTER COLUMN "title" DROP NOT NULL,
  ALTER COLUMN "link_id" TYPE text,
  ALTER COLUMN "link_id" DROP NOT NULL,
  ALTER COLUMN "created_at" DROP DEFAULT,
  ALTER COLUMN "created_at" DROP NOT NULL,
  ALTER COLUMN "created_at" TYPE text,
  ALTER COLUMN "book_id" TYPE text,
  ALTER COLUMN "book_id" DROP NOT NULL,
  DROP COLUMN IF EXISTS "deleted_at";

ALTER TABLE IF EXISTS "public"."books_attributes" 
  ALTER COLUMN "book_id" TYPE text,
  ALTER COLUMN "book_id" DROP NOT NULL,
  ALTER COLUMN "attribute_id" TYPE text,
  ALTER COLUMN "attribute_id" DROP NOT NULL;

ALTER TABLE IF EXISTS "public"."books" 
  ALTER COLUMN "uuid" DROP DEFAULT,
  ALTER COLUMN "uuid" DROP NOT NULL,
  ALTER COLUMN "uuid" TYPE text,
  ALTER COLUMN "updated_at" DROP DEFAULT,
  ALTER COLUMN "updated_at" DROP NOT NULL,
  ALTER COLUMN "updated_at" TYPE text,
  ALTER COLUMN "title" DROP NOT NULL,
  ALTER COLUMN "created_at" DROP DEFAULT,
  ALTER COLUMN "created_at" DROP NOT NULL,
  ALTER COLUMN "created_at" TYPE text,
  DROP COLUMN IF EXISTS "deleted_at";

ALTER TABLE IF EXISTS "public"."attributes" 
  ALTER COLUMN "value" DROP NOT NULL,
  ALTER COLUMN "uuid" DROP DEFAULT,
  ALTER COLUMN "uuid" DROP NOT NULL,
  ALTER COLUMN "uuid" TYPE text,
  ALTER COLUMN "key" DROP NOT NULL;