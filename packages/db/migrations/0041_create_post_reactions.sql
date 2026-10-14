CREATE TABLE IF NOT EXISTS post_reactions (
  post_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  reaction ENUM('like', 'love', 'celebrate', 'insightful', 'funny') NOT NULL DEFAULT 'like',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, user_id),
  KEY idx_post_reactions_user (user_id),
  CONSTRAINT fk_post_reactions_post FOREIGN KEY (post_id) REFERENCES social_posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_post_reactions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
