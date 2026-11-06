-- Codes texted to confirm a member owns a phone number. users.login_phone is
-- only set once one is confirmed. Only a hash of each code is stored; the rows
-- also limit how many texts anyone can trigger.
CREATE TABLE IF NOT EXISTS phone_verifications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  phone VARCHAR(20) NOT NULL,
  code_hash CHAR(64) NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ip VARCHAR(64) NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_phone_verifications_user (user_id, created_at),
  KEY idx_phone_verifications_phone (phone, created_at),
  KEY idx_phone_verifications_ip (ip, created_at),
  KEY idx_phone_verifications_created (created_at),
  CONSTRAINT fk_phone_verifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
