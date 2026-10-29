CREATE TABLE IF NOT EXISTS qb_discussions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  question_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  kind ENUM('insight', 'correction', 'remark', 'explanation') NOT NULL DEFAULT 'insight',
  body TEXT NOT NULL,
  helpful_count INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('visible', 'hidden') NOT NULL DEFAULT 'visible',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_qb_discussions_question (question_id, status, id),
  CONSTRAINT fk_qb_discussions_question FOREIGN KEY (question_id) REFERENCES qb_questions (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_discussions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
