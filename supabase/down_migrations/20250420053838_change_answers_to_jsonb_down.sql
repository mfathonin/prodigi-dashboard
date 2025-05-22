-- Revert to integer array type
ALTER TABLE public.answer_sheets 
  RENAME COLUMN answers TO answers_new;

ALTER TABLE public.answer_sheets
  ADD COLUMN answers integer[];

UPDATE public.answer_sheets
SET answers = jsonb_to_int_array_replace_nested(answers_new);

ALTER TABLE public.answer_sheets
  ALTER COLUMN answers SET NOT NULL;

ALTER TABLE public.answer_sheets
  DROP COLUMN answers_new,
  DROP CONSTRAINT IF EXISTS answers_check,
  DROP CONSTRAINT IF EXISTS points_check,
  DROP CONSTRAINT IF EXISTS n_options_check;

-- Revert constraints
ALTER TABLE public.answer_sheets
  ADD CONSTRAINT answers_sheets_check
    CHECK (array_position(answers, NULL) IS NULL AND array_length(answers, 1) = counts),
  ADD CONSTRAINT answer_sheets_check1
    CHECK (array_position(points, NULL) IS NULL AND array_length(points, 1) = counts),
  ADD CONSTRAINT answer_sheets__check2
    CHECK (array_position(n_options, NULL) IS NULL AND array_length(n_options, 1) = counts);