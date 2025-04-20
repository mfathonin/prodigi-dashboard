ALTER TABLE "public"."contents"
  ALTER COLUMN "type" drop NOT NULL,
  ALTER COLUMN "type" drop default;

-- Change type column to text type to allow any string values
ALTER TABLE "public"."contents"
  ALTER COLUMN type type text;

-- Change quiz type to answer_sheet
UPDATE public.contents
  SET type = 'answer_sheet'
  WHERE type = 'quiz';

ALTER TYPE "public"."content_type"
  RENAME TO "content_type__old_version_to_be_dropped";

CREATE TYPE "public"."content_type" AS ENUM ('content', 'answer_sheet', 'exercise');

ALTER TABLE "public"."contents"
  ALTER COLUMN type type "public"."content_type" USING TYPE::TEXT::"public"."content_type";

ALTER TABLE "public"."contents"
  ALTER COLUMN "type"
  SET DEFAULT 'content'::content_type;

DROP TYPE "public"."content_type__old_version_to_be_dropped";

-- Fallback if there any NULL value we assume it is an `exercise`. 
-- This assumtion come from down migration script
UPDATE "public"."contents"
  SET type = 'exercise'::content_type
  WHERE type IS NULL;

-- Set back 'type' column to not null
ALTER TABLE "public"."contents"
  ALTER COLUMN "type"
  SET NOT NULL;