CREATE TABLE IF NOT EXISTS group_members (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  role ENUM('owner', 'admin', 'moderator', 'member') NOT NULL DEFAULT 'member',
  status ENUM('active', 'pending', 'banned') NOT NULL DEFAULT 'active',
  title VARCHAR(80) NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_group_members (group_id, user_id),
  KEY idx_group_members_user (user_id, status),
  CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES campus_groups (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
