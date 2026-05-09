-- ============================================================
-- PURCHASE REQUESTS (Buyer standing orders)
-- ============================================================
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_type VARCHAR(80) NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  max_price NUMERIC(12,2),
  currency VARCHAR(5) DEFAULT 'GHS',
  delivery_radius_km INTEGER DEFAULT 60,
  center_location GEOGRAPHY(POINT, 4326) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchase_requests_location ON purchase_requests USING GIST(center_location);

-- ============================================================
-- MATCHES (Listing ↔ Purchase Request pairs)
-- ============================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  purchase_request_id UUID REFERENCES purchase_requests(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  farmer_id UUID NOT NULL REFERENCES users(id),
  match_score NUMERIC(5,2), -- Ranking score
  distance_km NUMERIC(8,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending','accepted','countered','declined','expired')),
  proposed_price NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
