-- LeadGen onboarding for student accounts: the campaign target they chose
-- (which unlocked Capevars' private lists tagged with it), and when they
-- finished, so the onboarding shows once.
ALTER TABLE users
  ADD COLUMN leadgen_campaign VARCHAR(40) NULL AFTER member_type,
  ADD COLUMN leadgen_onboarded_at DATETIME NULL AFTER leadgen_campaign;
