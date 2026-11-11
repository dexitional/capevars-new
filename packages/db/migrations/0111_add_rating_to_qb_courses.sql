-- A Quizbank course's average review rating and count, kept up to date as
-- members review it, so lists can show them without counting.
ALTER TABLE qb_courses
  ADD COLUMN rating_avg DECIMAL(2, 1) NULL AFTER board_count,
  ADD COLUMN rating_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER rating_avg;
