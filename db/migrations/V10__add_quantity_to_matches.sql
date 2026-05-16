-- Add quantity_kg to matches table to support partial offers
ALTER TABLE matches ADD COLUMN quantity_kg NUMERIC(10,2);
