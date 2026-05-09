-- Run once on DB creation
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('farmer','buyer','cooperative','agent','admin')),
  email VARCHAR(150),
  location GEOGRAPHY(POINT, 4326), -- PostGIS point (lng, lat)
  region VARCHAR(100),
  country VARCHAR(60) DEFAULT 'GH',
  trust_score NUMERIC(3,2) DEFAULT 5.00,
  is_verified BOOLEAN DEFAULT FALSE,
  momo_number VARCHAR(20), -- Mobile money (stored encrypted)
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
