-- Modify answers column type and constraints
ALTER TABLE public.answer_sheets 
  RENAME COLUMN answers TO answers_old;

ALTER TABLE public.answer_sheets
  ADD COLUMN answers jsonb;

UPDATE public.answer_sheets 
SET answers = to_jsonb(answers_old);

ALTER TABLE public.answer_sheets
  ALTER COLUMN answers SET NOT NULL;

ALTER TABLE public.answer_sheets
  DROP CONSTRAINT answer_sheets_check,
  DROP CONSTRAINT answer_sheets_check1,
  DROP CONSTRAINT answer_sheets_check2,
  DROP COLUMN answers_old;

ALTER TABLE public.answer_sheets
  ADD CONSTRAINT answers_checks 
    CHECK (jsonb_typeof(answers) = 'array'),
  ADD CONSTRAINT points_check 
    CHECK (
      array_position(points, NULL) IS NULL AND 
      array_length(points, 1) = counts
    ),
  ADD CONSTRAINT n_options_check 
    CHECK (
      array_position(n_options, NULL) IS NULL AND 
      array_length(n_options, 1) = counts
    );

-- Prepare drop migration function to be used in down migration
CREATE OR REPLACE FUNCTION jsonb_to_int_array_replace_nested(data jsonb) RETURNS int[] AS $$
DECLARE
  result int[] := '{}';
  element jsonb;
BEGIN
  FOR element IN SELECT * FROM jsonb_array_elements(data) LOOP
    IF jsonb_typeof(element) = 'array' THEN
      -- Replace nested arrays with 0
      result := array_append(result, 0);
    ELSE
      -- For regular elements, take the value directly
      result := array_append(result, (element#>>'{}')::int);
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;