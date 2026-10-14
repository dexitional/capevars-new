CREATE TABLE IF NOT EXISTS credit_transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('purchase', 'voucher', 'admin', 'debit', 'refund') NOT NULL,
  credits DECIMAL(12, 2) NOT NULL,
  balance_after DECIMAL(12, 2) NOT NULL,
  amount_ghs DECIMAL(12, 2) NULL,
  payment_id INT UNSIGNED NULL,
  broadcast_id INT UNSIGNED NULL,
  reference VARCHAR(60) NULL,
  note VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_credit_transactions_user (user_id, id),
  CONSTRAINT fk_credit_transactions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
