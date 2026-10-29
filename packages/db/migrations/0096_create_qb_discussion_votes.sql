CREATE TABLE IF NOT EXISTS qb_discussion_votes (
  discussion_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (discussion_id, user_id),
  CONSTRAINT fk_qb_discussion_votes_discussion FOREIGN KEY (discussion_id) REFERENCES qb_discussions (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_discussion_votes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
