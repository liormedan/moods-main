const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

async function main() {
    console.log("=== DEEP DEBUG (REQUIRE) ===")

    try {
        const url = process.env.DATABASE_URL
        if (!url) {
            console.error("❌ DATABASE_URL is missing")
            return
        }
        console.log(`URL available (len: ${url.length})`)

        console.log("Importing @neondatabase/serverless...")
        const { neon } = require('@neondatabase/serverless')
        console.log("Import successful.")

        console.log("Creating sql instance...")
        const sql = neon(url)

        console.log("Executing query...")
        // Pass as template literal simulation if needed, or just string
        const result = await sql(url.includes(' ') ? [url] : 'SELECT 1')
        // The library usually handles raw strings if passed, but let's see.
        // If it is a tagged template function, it might fail with string.

        console.log("Result:", result)

    } catch (err: any) {
        console.error("❌ CRASHED:", err)
        if (err.stack) console.error("Stack:", err.stack)
    }
}

main()
