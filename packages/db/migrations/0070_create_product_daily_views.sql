-- Product page views per day, for seller and admin analytics (view trends
-- and conversion over a period). products.view_count stays the all-time
-- total. One row per product per day, bumped on each view.
CREATE TABLE IF NOT EXISTS product_daily_views (
  product_id INT UNSIGNED NOT NULL,
  day DATE NOT NULL,
  views INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, day),
  KEY idx_product_daily_views_day (day),
  CONSTRAINT fk_product_daily_views_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
