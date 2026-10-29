CREATE TABLE IF NOT EXISTS qb_attempts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  question_ids JSON NOT NULL,
  answers JSON NULL,
  results JSON NULL,
  minutes SMALLINT UNSIGNED NOT NULL,
  started_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  submitted_at DATETIME NULL,
  score DECIMAL(8, 2) NULL,
  max_score DECIMAL(8, 2) NULL,
  status ENUM('in_progress', 'marking', 'submitted') NOT NULL DEFAULT 'in_progress',
  PRIMARY KEY (id),
  KEY idx_qb_attempts_user (user_id, course_id, id),
  CONSTRAINT fk_qb_attempts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_attempts_course FOREIGN KEY (course_id) REFERENCES qb_courses (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
