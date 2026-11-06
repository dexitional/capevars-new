CREATE TABLE IF NOT EXISTS qb_bookmarks (
  user_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, question_id),
  KEY idx_qb_bookmarks_question (question_id),
  CONSTRAINT fk_qb_bookmarks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_bookmarks_question FOREIGN KEY (question_id) REFERENCES qb_questions (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
