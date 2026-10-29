CREATE TABLE IF NOT EXISTS qb_course_questions (
  course_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  position INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (course_id, question_id),
  KEY idx_qb_course_questions_question (question_id),
  KEY idx_qb_course_questions_order (course_id, position),
  CONSTRAINT fk_qb_course_questions_course FOREIGN KEY (course_id) REFERENCES qb_courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_course_questions_question FOREIGN KEY (question_id) REFERENCES qb_questions (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
