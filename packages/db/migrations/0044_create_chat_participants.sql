CREATE TABLE IF NOT EXISTS chat_participants (
  thread_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  last_read_at DATETIME NULL,
  is_muted TINYINT(1) NOT NULL DEFAULT 0,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (thread_id, user_id),
  KEY idx_chat_participants_user (user_id),
  CONSTRAINT fk_chat_participants_thread FOREIGN KEY (thread_id) REFERENCES chat_threads (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_chat_participants_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
