-- Add email column to therapist_info table and remove unused columns
ALTER TABLE therapist_info 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Remove unused columns
ALTER TABLE therapist_info 
DROP COLUMN IF EXISTS whatsapp,
DROP COLUMN IF EXISTS telegram;

-- Add comment
COMMENT ON COLUMN therapist_info.email IS 'Email address of therapist for contact';
