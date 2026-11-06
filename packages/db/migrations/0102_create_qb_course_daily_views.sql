-- Quizbank course page views per day, for admin analytics. One row per course
-- per day (UTC), bumped on each view; guest_views is the share with no member signed in.
CREATE TABLE IF NOT EXISTS qb_course_daily_views (
  course_id INT UNSIGNED NOT NULL,
  day DATE NOT NULL,
  views INT UNSIGNED NOT NULL DEFAULT 0,
  guest_views INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (course_id, day),
  KEY idx_qb_course_daily_views_day (day),
  CONSTRAINT fk_qb_course_daily_views_course FOREIGN KEY (course_id) REFERENCES qb_courses (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
