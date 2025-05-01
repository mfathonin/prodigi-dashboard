ALTER TABLE "public"."contents"
  ALTER COLUMN "type" drop NOT NULL,
  ALTER COLUMN "type" drop default;

ALTER TABLE "public"."contents"
  ALTER COLUMN TYPE type TEXT;

UPDATE public.contents
SET type = NULL
WHERE type = 'exercise';

UPDATE public.contents
SET type = 'quiz'
WHERE type = 'answer_sheet';

ALTER TYPE "public"."content_type"
  RENAME TO "content_type__old_version_to_be_dropped";

CREATE TYPE "public"."content_type" AS ENUM ('content', 'quiz');

ALTER TABLE "public"."contents"
  ALTER COLUMN TYPE type "public"."content_type" USING TYPE::TEXT::"public"."content_type";

ALTER TABLE "public"."contents"
  ALTER COLUMN "type"
  SET DEFAULT 'content'::content_type;

DROP TYPE "public"."content_type__old_version_to_be_dropped";