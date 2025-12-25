
import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL });

async function main() {
    try {
        console.log('Dropping legacy FK constraint on mood_entries...');
        // Try standard name
        await pool.query(`ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_user_id_fkey`);

        // Also try referencing auth.users explicitly if name is different? 
        // Usually it is mood_entries_user_id_fkey.

        console.log('Constraint dropped (if it existed).');

    } catch (err) {
        console.error('Error fixing mood_entries:', err);
    } finally {
        await pool.end();
    }
}

main();
