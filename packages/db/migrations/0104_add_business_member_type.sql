ALTER TABLE users MODIFY member_type ENUM('public', 'student', 'staff', 'alumni', 'business') NOT NULL DEFAULT 'public';
