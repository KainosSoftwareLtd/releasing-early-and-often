-- Initial schema for passport applications
CREATE TABLE passport_applications (
    id UUID DEFAULT random_uuid() PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_of_birth VARCHAR(255),
    previous_passport VARCHAR(255),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    town_city VARCHAR(255),
    postcode VARCHAR(255)
);

-- Add constraint to ensure status is valid
ALTER TABLE passport_applications
    ADD CONSTRAINT chk_status CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'COMPLETED'));
