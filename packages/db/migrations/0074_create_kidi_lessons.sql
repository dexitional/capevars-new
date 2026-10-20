CREATE TABLE IF NOT EXISTS kidi_lessons (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id INT UNSIGNED NOT NULL,
  source_key VARCHAR(100) NOT NULL,
  source_hash CHAR(64) NOT NULL,
  title VARCHAR(200) NOT NULL,
  strand VARCHAR(100) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL,
  explore_id INT UNSIGNED NOT NULL,
  play_id INT UNSIGNED NOT NULL,
  challenge_id INT UNSIGNED NOT NULL,
  payload JSON NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_kidi_lesson_source (course_id, source_key),
  CONSTRAINT fk_kidi_lesson_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT fk_kidi_lesson_explore FOREIGN KEY (explore_id) REFERENCES course_lessons (id) ON DELETE CASCADE,
  CONSTRAINT fk_kidi_lesson_play FOREIGN KEY (play_id) REFERENCES course_lessons (id) ON DELETE CASCADE,
  CONSTRAINT fk_kidi_lesson_challenge FOREIGN KEY (challenge_id) REFERENCES course_lessons (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
