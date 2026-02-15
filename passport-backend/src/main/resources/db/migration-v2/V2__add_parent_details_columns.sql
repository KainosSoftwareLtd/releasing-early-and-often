-- Add parent details columns for child passport applications (V2 API)
-- This migration is controlled by feature flag: feature.child-renewals.enabled
ALTER TABLE passport_applications ADD COLUMN parent1_full_name VARCHAR(255);
ALTER TABLE passport_applications ADD COLUMN parent1_contact VARCHAR(255);
ALTER TABLE passport_applications ADD COLUMN parent2_full_name VARCHAR(255);
ALTER TABLE passport_applications ADD COLUMN parent2_contact VARCHAR(255);
