-- ============================================================
-- HARVEST LISTINGS (Farmer posts)
-- ============================================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_type VARCHAR(80) NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  asking_price NUMERIC(12,2), -- per kg in local currency
  currency VARCHAR(5) DEFAULT 'GHS',
  harvest_date DATE NOT NULL,
  storage_method VARCHAR(50) NOT NULL CHECK (storage_method IN (
    'open_air','grain_bag','cold_store','silo','other')),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  region VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
    'active','matched','sold','expired','cancelled')),
  photo_urls TEXT[],
  -- Spoilage fields (populated by spoilage-engine)
  spoilage_days INTEGER, -- Days before 30% loss
  spoilage_risk VARCHAR(10), -- green / amber / red
  spoilage_score NUMERIC(5,2), -- 0-100 loss estimate
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geospatial index for proximity matching
CREATE INDEX idx_listings_location ON listings USING GIST(location);
CREATE INDEX idx_listings_status_crop ON listings(status, crop_type);
