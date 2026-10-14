CREATE TABLE IF NOT EXISTS broadcast_optouts (
  channel ENUM('sms', 'email') NOT NULL,
  address VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (channel, address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
