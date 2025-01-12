-- Create enum type for content types
CREATE TYPE public.content_type AS ENUM ('content', 'quiz');

-- Add type column to contents table
ALTER TABLE
  public.contents
ADD
  COLUMN "type" public.content_type DEFAULT 'content';

-- Then make it NOT NULL after default value is applied
ALTER TABLE
  public.contents
ALTER COLUMN
  "type"
SET
  NOT NULL;

-- Update existing quiz content types based on link pattern
UPDATE
  public.contents
SET
  type = 'quiz'
WHERE
  EXISTS (
    SELECT
      1
    FROM
      public.link
    WHERE
      link.uuid = contents.link_id
      AND link.target_url LIKE '%/quiz/%'
      AND length(
        regexp_replace(
          split_part(link.target_url, '/quiz/', 2),
          '[^0-9a-f-]',
          '',
          'g'
        )
      ) = 36
  );