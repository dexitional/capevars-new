CREATE TABLE IF NOT EXISTS kidi_children (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_user_id INT UNSIGNED NOT NULL,
  display_name VARCHAR(60) NOT NULL,
  level_key VARCHAR(8) NOT NULL,
  avatar_key VARCHAR(20) NOT NULL DEFAULT 'sun',
  code_hash CHAR(64) NOT NULL,
  code_version INT UNSIGNED NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_kidi_child_code (code_hash),
  KEY idx_kidi_children_parent (parent_user_id),
  CONSTRAINT fk_kidi_child_parent FOREIGN KEY (parent_user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
