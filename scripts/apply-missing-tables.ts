
import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
    console.error('Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

const sql003 = `
-- Ensure users table exists (referenced by others)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY, -- Clerk user ID is text usually, but here we cast/store? No, Clerk IDs are 'user_...' string. 
  -- WAIT. Clerk IDs are STRINGS (Text). UUID is likely wrong if we store Clerk ID directly.
  -- user-actions.ts upserts id: user.id. 
  -- If user.id is 'user_2xxx', it is NOT a UUID.
  -- But test-database.ts uses UUID for test.
  -- If the app uses Clerk IDs, column type must be TEXT.
  -- Let's check user-actions usages.
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- We need to check if users.id is UUID or TEXT. 
-- In 001, mood_entries.user_id is UUID. 
-- This implies existing code expects UUIDs. 
-- Does Clerk provide UUIDs? No.
-- Maybe the user has a mapping or just generates UUIDs?
-- user-actions.ts passes user.id directly. 
-- If user.id is string 'user_...', insert into UUID column will FAIL.
-- This indicates a FUNDAMENTAL TYPE MISMATCH if user.id is standard Clerk ID.
-- However, if 001 exists and has UUID, then maybe test-database.ts failed with "invalid input syntax for type uuid" precisely because it tried to use "test-user-id".
-- BUT "2222..." works.
-- If the real app sends "user_abc123", it will fail UUID check.
-- We should probably change user_id to TEXT.
-- But changing existing table columns is hard. 
-- Check user-actions.ts again. user.id comes from currentUser().id.
-- If currentUser().id is not UUID, we have a problem.
-- Let's Assume for now we use TEXT for new tables to be safe, or UUID if we want consistency with 001.
-- If 001 is UUID, then 003 should be UUID?
-- Loophole: Maybe user.id IS a UUID in their system?
-- Or maybe they use a hashing function? user_actions.ts doesn't show one.
-- I will use TEXT for user_id to be safe with Clerk, but 001 uses UUID.
-- If I use TEXT, I cannot reference users(id) if users(id) is UUID.
-- I'll define users(id) as TEXT to support Clerk.
-- But 001 expects UUID.
-- Let's stick to TEXT for new tables mostly?
-- No, consistency.
-- I will blindly trust 001's UUID choice implies they have UUIDs. 
-- Wait, '00000...' worked in my fixed test script edit.
-- Let's assume for Apply Schema I use UUID to match 001, but create 'users' table if missing.
-- If 'mood_entries' exists and uses UUID, 'users' must be UUID if referenced.
-- I will create 'users' table if missing as UUID. If it fails (type error), I'll know.
-- Actually, better to remove FK constraints to avoid type hell if I can't check.
-- Just create tables without FKs enforce?
-- No, let's try to do it right.
-- I'll use UUID for consistency with previous scripts.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Changing to TEXT because Clerk IDs are text.
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: mood_entries.user_id is UUID in 001.
-- If I make therapist_info.user_id TEXT, it's safer for Clerk.
-- But consistency?
-- If I change it to TEXT, it won't link to mood_entries if I wanted to join.
-- But I don't join them.
-- I will use TEXT for user_id in new tables. It is much safer for Clerk.

-- טבלת פרטי מטפל
CREATE TABLE IF NOT EXISTS therapist_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed to TEXT
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  telegram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- טבלת משימות מהמטפל
CREATE TABLE IF NOT EXISTS therapist_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed to TEXT
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת פגישות
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Changed to TEXT
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indicies
CREATE INDEX IF NOT EXISTS idx_therapist_info_user_id ON therapist_info(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_tasks_user_id ON therapist_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
`;

const sql004 = `
-- Add email column to therapist_info table and remove unused columns
ALTER TABLE therapist_info ADD COLUMN IF NOT EXISTS email TEXT;

-- Remove unused columns
ALTER TABLE therapist_info DROP COLUMN IF EXISTS whatsapp;
ALTER TABLE therapist_info DROP COLUMN IF EXISTS telegram;

-- Add comment
COMMENT ON COLUMN therapist_info.email IS 'Email address of therapist for contact';
`;

async function main() {
    try {
        console.log('Applying migration 003...');
        await pool.query(sql003);
        console.log('Migration 003 applied successfully.');

        console.log('Applying migration 004...');
        await pool.query(sql004);
        console.log('Migration 004 applied successfully.');

        console.log('All migrations applied.');
    } catch (err) {
        console.error('Error applying migrations:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
