ALTER TABLE payments MODIFY purpose ENUM('order', 'ticket', 'enrollment', 'donation', 'booth', 'lead', 'credits') NOT NULL;
