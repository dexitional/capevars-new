CREATE TABLE IF NOT EXISTS kidi_child_photos (
  child_id INT UNSIGNED NOT NULL,
  asset_id INT UNSIGNED NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (child_id),
  KEY idx_kidi_child_photo_asset (asset_id),
  CONSTRAINT fk_kidi_photo_child FOREIGN KEY (child_id) REFERENCES kidi_children (id) ON DELETE CASCADE,
  CONSTRAINT fk_kidi_photo_asset FOREIGN KEY (asset_id) REFERENCES media_assets (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
