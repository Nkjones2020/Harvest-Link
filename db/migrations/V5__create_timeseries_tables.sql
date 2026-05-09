-- SPOILAGE DECAY LOG (TimescaleDB hypertable)
-- ============================================================
CREATE TABLE spoilage_readings (
  time TIMESTAMPTZ NOT NULL,
  listing_id UUID NOT NULL REFERENCES listings(id),
  temperature_c NUMERIC(5,2),
  humidity_pct NUMERIC(5,2),
  loss_pct NUMERIC(5,2),
  days_remaining NUMERIC(5,1)
);

-- Convert to TimescaleDB hypertable (partitioned by time)
SELECT create_hypertable('spoilage_readings', 'time');

-- ============================================================
-- AUDIT LOG (Immutable financial events)
-- ============================================================
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(60) NOT NULL,
  entity_id UUID,
  user_id UUID,
  payload JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
