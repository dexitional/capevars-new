CREATE TABLE IF NOT EXISTS lead_payouts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  momo_number VARCHAR(30) NOT NULL,
  momo_name VARCHAR(150) NOT NULL,
  status ENUM('requested', 'paid', 'rejected') NOT NULL DEFAULT 'requested',
  note VARCHAR(500) NULL,
  handled_by INT UNSIGNED NULL,
  handled_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lead_payouts_user (user_id),
  KEY idx_lead_payouts_status (status),
  CONSTRAINT fk_lead_payouts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lead_payouts_admin FOREIGN KEY (handled_by) REFERENCES admins (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
