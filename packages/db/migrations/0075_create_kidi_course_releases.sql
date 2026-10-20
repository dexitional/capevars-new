CREATE TABLE IF NOT EXISTS kidi_course_releases (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id INT UNSIGNED NOT NULL,
  version SMALLINT UNSIGNED NOT NULL,
  source_hash CHAR(64) NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  manifest JSON NOT NULL,
  imported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_kidi_release_source (course_id, source_hash),
  CONSTRAINT fk_kidi_release_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
