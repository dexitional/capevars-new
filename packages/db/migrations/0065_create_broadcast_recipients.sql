CREATE TABLE IF NOT EXISTS broadcast_recipients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  broadcast_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NULL,
  address VARCHAR(150) NOT NULL,
  status ENUM('queued', 'sent', 'failed') NOT NULL DEFAULT 'queued',
  provider_ref VARCHAR(100) NULL,
  provider_status VARCHAR(60) NULL,
  error VARCHAR(300) NULL,
  sent_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_broadcast_recipients (broadcast_id, address),
  KEY idx_broadcast_recipients_status (broadcast_id, status),
  CONSTRAINT fk_broadcast_recipients_broadcast FOREIGN KEY (broadcast_id) REFERENCES broadcasts (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
