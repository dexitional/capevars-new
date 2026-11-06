-- login_phone is the number a member signs in and resets their password with,
-- in normalised form. It's separate from the free-form profile phone, which
-- isn't unique. session_valid_from (epoch seconds) ends sessions started before
-- a password change.
ALTER TABLE users
  ADD COLUMN login_phone VARCHAR(20) NULL AFTER phone,
  ADD COLUMN session_valid_from INT UNSIGNED NULL AFTER locked_until,
  ADD UNIQUE KEY uq_users_login_phone (login_phone);
