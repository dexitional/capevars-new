CREATE TABLE IF NOT EXISTS market_categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id INT UNSIGNED NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  icon VARCHAR(40) NOT NULL DEFAULT 'shopping-bag',
  image_url VARCHAR(500) NULL,
  description VARCHAR(255) NULL,
  is_food TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_market_categories_slug (slug),
  KEY idx_market_categories_parent (parent_id, sort_order),
  CONSTRAINT fk_market_categories_parent FOREIGN KEY (parent_id) REFERENCES market_categories (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
