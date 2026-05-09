-- ============================================================
-- CROP PROFILES (Baseline data for spoilage engine)
-- ============================================================
CREATE TABLE IF NOT EXISTS crop_profiles (
  id SERIAL PRIMARY KEY,
  crop_name VARCHAR(80) UNIQUE NOT NULL,
  daily_loss_rate_pct NUMERIC(5,3) NOT NULL, -- % loss/day at 25°C open air
  cold_store_factor NUMERIC(4,2) DEFAULT 4.0, -- multiplier for cold storage
  grain_bag_factor NUMERIC(4,2) DEFAULT 1.5,
  silo_factor NUMERIC(4,2) DEFAULT 5.0,
  optimal_temp_c NUMERIC(4,1),
  optimal_humidity NUMERIC(4,1),
  notes TEXT
);

INSERT INTO crop_profiles (crop_name, daily_loss_rate_pct, cold_store_factor, grain_bag_factor, silo_factor, optimal_temp_c, optimal_humidity) VALUES
('tomatoes', 10.500, 4.0, 1.2, 1.0, 12.0, 90.0),
('maize', 0.500, 2.0, 1.5, 5.0, 15.0, 13.0),
('onions', 2.000, 5.0, 1.5, 1.0, 0.0, 65.0),
('cassava', 15.000, 2.0, 1.2, 1.0, 25.0, 85.0),
('yam', 5.000, 3.0, 1.2, 1.0, 15.0, 70.0),
('plantain', 8.000, 4.0, 1.2, 1.0, 14.0, 85.0),
('pepper', 7.000, 4.0, 1.2, 1.0, 10.0, 90.0),
('cabbage', 9.000, 6.0, 1.2, 1.0, 0.0, 95.0),
('carrot', 6.000, 8.0, 1.2, 1.0, 0.0, 98.0),
('beans', 0.800, 2.0, 1.8, 5.0, 15.0, 12.0)
ON CONFLICT (crop_name) DO NOTHING;
