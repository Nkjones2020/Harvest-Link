-- ============================================================
-- TRANSACTIONS (Confirmed deals)
-- ============================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  farmer_id UUID NOT NULL REFERENCES users(id),
  quantity_kg NUMERIC(10,2) NOT NULL,
  agreed_price NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(14,2) NOT NULL,
  platform_fee NUMERIC(10,2),
  currency VARCHAR(5) DEFAULT 'GHS',
  payment_status VARCHAR(20) DEFAULT 'escrow' CHECK (payment_status IN (
    'pending','escrow','released','refunded','disputed')),
  payment_ref VARCHAR(100), -- Flutterwave/MoMo reference
  delivery_confirmed BOOLEAN DEFAULT FALSE,
  delivery_at TIMESTAMPTZ,
  trade_agreement_url TEXT, -- Signed PDF stored in S3
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RATINGS
-- ============================================================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  rater_id UUID NOT NULL REFERENCES users(id),
  ratee_id UUID NOT NULL REFERENCES users(id),
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, rater_id)
);
