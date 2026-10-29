ALTER TABLE broadcasts ADD COLUMN series_id INT UNSIGNED NULL AFTER user_id, ADD KEY idx_broadcasts_series (series_id);
