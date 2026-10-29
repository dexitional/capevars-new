CREATE TABLE IF NOT EXISTS qb_board (
  user_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  exam_questions SMALLINT UNSIGNED NULL,
  exam_minutes SMALLINT UNSIGNED NULL,
  study_position INT UNSIGNED NOT NULL DEFAULT 0,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id),
  KEY idx_qb_board_course (course_id),
  CONSTRAINT fk_qb_board_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_board_course FOREIGN KEY (course_id) REFERENCES qb_courses (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
