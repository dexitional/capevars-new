CREATE TABLE IF NOT EXISTS page_followers (
  page_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  notify TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (page_id, user_id),
  KEY idx_page_followers_user (user_id),
  CONSTRAINT fk_page_followers_page FOREIGN KEY (page_id) REFERENCES social_pages (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_page_followers_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
