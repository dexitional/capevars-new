CREATE TABLE IF NOT EXISTS ticket_types (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_id INT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  quantity INT UNSIGNED NOT NULL,
  sold INT UNSIGNED NOT NULL DEFAULT 0,
  max_per_order TINYINT UNSIGNED NOT NULL DEFAULT 10,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_ticket_types_event (event_id, sort_order),
  CONSTRAINT fk_ticket_types_event FOREIGN KEY (event_id) REFERENCES ticket_events (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
