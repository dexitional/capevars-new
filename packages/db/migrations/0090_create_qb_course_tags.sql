CREATE TABLE IF NOT EXISTS qb_course_tags (
  course_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (course_id, tag_id),
  KEY idx_qb_course_tags_tag (tag_id),
  CONSTRAINT fk_qb_course_tags_course FOREIGN KEY (course_id) REFERENCES qb_courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_course_tags_tag FOREIGN KEY (tag_id) REFERENCES qb_tags (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
