CREATE TABLE IF NOT EXISTS group_campaigns (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  story TEXT NULL,
  cover_url VARCHAR(500) NULL,
  goal_amount DECIMAL(12, 2) NOT NULL,
  raised_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  donor_count INT UNSIGNED NOT NULL DEFAULT 0,
  momo_number VARCHAR(30) NULL,
  momo_name VARCHAR(150) NULL,
  ends_on DATE NULL,
  status ENUM('active', 'closed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_group_campaigns_group (group_id, status),
  CONSTRAINT fk_group_campaigns_group FOREIGN KEY (group_id) REFERENCES campus_groups (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
