ALTER TABLE qb_attempts
  MODIFY course_id INT UNSIGNED NULL,
  ADD COLUMN variation_id INT UNSIGNED NULL AFTER course_id,
  ADD COLUMN title VARCHAR(200) NULL AFTER variation_id,
  ADD CONSTRAINT fk_qb_attempts_variation FOREIGN KEY (variation_id) REFERENCES qb_variations (id) ON DELETE SET NULL ON UPDATE CASCADE;
