CREATE TABLE IF NOT EXISTS bus_rentals (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  seller_id INT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  vehicle_type VARCHAR(60) NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  description TEXT NULL,
  images JSON NULL,
  features JSON NULL,
  status ENUM('active', 'hidden', 'blocked') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bus_rentals_seller (seller_id),
  CONSTRAINT fk_bus_rentals_seller FOREIGN KEY (seller_id) REFERENCES sellers (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
