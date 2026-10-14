CREATE TABLE IF NOT EXISTS lead_contacts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  list_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(150) NULL,
  organization VARCHAR(150) NULL,
  role VARCHAR(100) NULL,
  location VARCHAR(150) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lead_contacts_list (list_id, id),
  UNIQUE KEY uq_lead_contacts_phone (list_id, phone),
  UNIQUE KEY uq_lead_contacts_email (list_id, email),
  CONSTRAINT fk_lead_contacts_list FOREIGN KEY (list_id) REFERENCES lead_lists (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
