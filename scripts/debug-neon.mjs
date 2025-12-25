import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log("=== ESM POOL DEBUG ===");

async function main() {
    try {
        console.log("Importing Pool...");
        const { Pool } = await import('@neondatabase/serverless');
        console.log("Import success.");

        const url = process.env.DATABASE_URL;
        if (!url) { console.error("No URL"); return; }

        console.log("URL detected.");

        const pool = new Pool({ connectionString: url });
        console.log("Pool created. Querying...");

        const result = await pool.query("SELECT 1 as val");
        console.log("Query success!", result.rows);
        await pool.end();

    } catch (e) {
        console.error("❌ CRASHED:", e);
    }
}

main();
