-- Which signed-in members viewed a Quizbank course, per day (UTC), for admin
-- analytics: unique viewers over a period and each member's own view count.
CREATE TABLE IF NOT EXISTS qb_course_member_views (
  course_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  day DATE NOT NULL,
  views INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (course_id, user_id, day),
  KEY idx_qb_course_member_views_day (day),
  KEY idx_qb_course_member_views_user (user_id),
  CONSTRAINT fk_qb_course_member_views_course FOREIGN KEY (course_id) REFERENCES qb_courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_qb_course_member_views_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
