CREATE TABLE IF NOT EXISTS favourites (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  entity_type ENUM('listing', 'product', 'job', 'course', 'event', 'store') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_favourites (user_id, entity_type, entity_id),
  KEY idx_favourites_entity (entity_type, entity_id),
  CONSTRAINT fk_favourites_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
