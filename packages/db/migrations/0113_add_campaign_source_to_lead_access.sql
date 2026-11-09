-- Access to Capevars' private lists that a student's chosen LeadGen campaign
-- unlocked. Kept separate from admin shares so it can follow the student's
-- campaign and the lists' tags without touching other access.
ALTER TABLE lead_access MODIFY source ENUM('owner', 'free', 'purchase', 'share', 'admin', 'campaign') NOT NULL;
