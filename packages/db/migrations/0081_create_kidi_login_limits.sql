CREATE TABLE IF NOT EXISTS kidi_login_limits (
  bucket_key CHAR(64) NOT NULL,
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (bucket_key),
  KEY idx_kidi_login_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
