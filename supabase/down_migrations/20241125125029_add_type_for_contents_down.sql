-- First, remove the not null constraint if it exists
ALTER TABLE
  contents
ALTER COLUMN
  type DROP NOT NULL;

-- Then drop the column
ALTER TABLE
  contents DROP COLUMN IF EXISTS type;

-- Finally, drop the enum type
DROP TYPE IF EXISTS content_type;