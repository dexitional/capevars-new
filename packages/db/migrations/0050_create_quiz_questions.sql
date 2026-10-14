CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  lesson_id INT UNSIGNED NOT NULL,
  question VARCHAR(1000) NOT NULL,
  options JSON NOT NULL,
  correct_index TINYINT UNSIGNED NOT NULL,
  explanation VARCHAR(1000) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_quiz_questions_lesson (lesson_id, sort_order),
  CONSTRAINT fk_quiz_questions_lesson FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
