CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  lesson_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  body TEXT NULL,
  file_url VARCHAR(500) NULL,
  grade TINYINT UNSIGNED NULL,
  feedback VARCHAR(2000) NULL,
  status ENUM('submitted', 'graded', 'resubmit') NOT NULL DEFAULT 'submitted',
  graded_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_assignment_submissions (lesson_id, user_id),
  CONSTRAINT fk_assignment_submissions_lesson FOREIGN KEY (lesson_id) REFERENCES course_lessons (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_assignment_submissions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
