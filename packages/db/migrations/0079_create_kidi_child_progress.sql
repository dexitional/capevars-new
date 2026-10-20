CREATE TABLE IF NOT EXISTS kidi_child_progress (
  child_id INT UNSIGNED NOT NULL,
  lesson_id INT UNSIGNED NOT NULL,
  quiz_score TINYINT UNSIGNED NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (child_id, lesson_id),
  CONSTRAINT fk_kidi_child_progress FOREIGN KEY (child_id) REFERENCES kidi_children (id) ON DELETE CASCADE,
  CONSTRAINT fk_kidi_child_progress_lesson FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
