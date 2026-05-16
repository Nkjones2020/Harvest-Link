-- Add unique constraint to matches to prevent duplicate connections
-- between the same listing and purchase request (or buyer)
ALTER TABLE matches ADD CONSTRAINT unique_listing_request UNIQUE (listing_id, purchase_request_id);

-- If purchase_request_id is NULL (manual offer), we might need another constraint
-- but for now this covers the automated matches.
