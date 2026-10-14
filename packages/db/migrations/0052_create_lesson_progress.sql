CREATE TABLE IF NOT EXISTS lesson_progress (
  enrollment_id INT UNSIGNED NOT NULL,
  lesson_id INT UNSIGNED NOT NULL,
  quiz_score TINYINT UNSIGNED NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (enrollment_id, lesson_id),
  CONSTRAINT fk_lesson_progress_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lesson_progress_lesson FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
