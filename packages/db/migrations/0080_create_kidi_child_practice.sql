CREATE TABLE IF NOT EXISTS kidi_child_practice (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  child_id INT UNSIGNED NOT NULL,
  lesson_id INT UNSIGNED NOT NULL,
  phase ENUM('play', 'challenge') NOT NULL,
  score TINYINT UNSIGNED NOT NULL,
  passed TINYINT(1) NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_kidi_child_practice (child_id, submitted_at),
  CONSTRAINT fk_kidi_child_practice FOREIGN KEY (child_id) REFERENCES kidi_children (id) ON DELETE CASCADE,
  CONSTRAINT fk_kidi_child_practice_lesson FOREIGN KEY (lesson_id) REFERENCES kidi_lessons (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
