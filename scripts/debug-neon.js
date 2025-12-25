const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Manually load env if dotenv fails (unlikely)
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log("Loading .env.local form " + envPath);
    dotenv.config({ path: envPath });
} else {
    console.error(".env.local not found at " + envPath);
}

async function main() {
    console.log("=== PURE NODE DEBUG ===");
    console.log("Node version:", process.version);

    try {
        console.log("Requiring @neondatabase/serverless...");
        const neonModule = require('@neondatabase/serverless');
        console.log("Module loaded keys:", Object.keys(neonModule));

        const { neon } = neonModule;
        const url = process.env.DATABASE_URL;

        if (!url) {
            console.error("❌ No DATABASE_URL");
            return;
        }

        console.log("URL prefix:", url.substring(0, 15));

        const sql = neon(url);
        console.log("Executing SQL...");

        // Pass string directly
        const result = await sql("SELECT 1 as val");
        console.log("Query success!", result);

    } catch (e) {
        console.error("❌ CRASHED:");
        console.error(e);
        if (e.code === 'MODULE_NOT_FOUND') {
            console.error("Module not found. Checking node_modules...");
            // list node_modules
            try {
                const nm = fs.readdirSync(path.resolve(__dirname, '../node_modules/@neondatabase'));
                console.log("@neondatabase contents:", nm);
            } catch (err) {
                console.log("Could not list @neondatabase:", err.message);
            }
        }
    }
}

main();
