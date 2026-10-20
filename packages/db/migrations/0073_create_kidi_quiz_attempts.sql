CREATE TABLE IF NOT EXISTS kidi_quiz_attempts (
  id CHAR(36) NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  level_key VARCHAR(8) NOT NULL,
  subject_key VARCHAR(32) NOT NULL,
  questions JSON NOT NULL,
  pass_mark TINYINT UNSIGNED NOT NULL,
  answers JSON NULL,
  score TINYINT UNSIGNED NULL,
  passed TINYINT(1) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_kidi_attempt_user (user_id, created_at),
  CONSTRAINT fk_kidi_attempt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
