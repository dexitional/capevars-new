-- A course is free until its subscription is switched on. subscription_days is
-- how long a payment gives access for; NULL means it doesn't expire.
ALTER TABLE qb_courses
  ADD COLUMN subscription_enabled TINYINT(1) NOT NULL DEFAULT 0 AFTER exam_minutes,
  ADD COLUMN subscription_fee DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER subscription_enabled,
  ADD COLUMN subscription_days SMALLINT UNSIGNED NULL DEFAULT 30 AFTER subscription_fee;
