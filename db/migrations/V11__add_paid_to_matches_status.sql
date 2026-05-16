-- Update matches status constraint to include 'paid'
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_status_check;
ALTER TABLE matches ADD CONSTRAINT matches_status_check CHECK (status IN ('pending','accepted','countered','declined','expired','paid'));
