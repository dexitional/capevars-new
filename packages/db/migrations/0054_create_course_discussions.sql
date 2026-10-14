CREATE TABLE IF NOT EXISTS course_discussions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id INT UNSIGNED NOT NULL,
  lesson_id INT UNSIGNED NULL,
  user_id INT UNSIGNED NOT NULL,
  parent_id INT UNSIGNED NULL,
  title VARCHAR(200) NULL,
  body TEXT NOT NULL,
  reply_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_hidden TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_course_discussions_course (course_id, parent_id, created_at),
  CONSTRAINT fk_course_discussions_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_course_discussions_lesson FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_course_discussions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_course_discussions_parent FOREIGN KEY (parent_id) REFERENCES course_discussions (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
