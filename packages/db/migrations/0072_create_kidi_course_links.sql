CREATE TABLE IF NOT EXISTS kidi_course_links (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  level_key VARCHAR(8) NOT NULL,
  subject_key VARCHAR(32) NOT NULL,
  course_id INT UNSIGNED NULL,
  directory_ref VARCHAR(255) NULL,
  source_url VARCHAR(1000) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_kidi_course_level_subject (level_key, subject_key),
  CONSTRAINT fk_kidi_course_link FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
