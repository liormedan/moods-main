import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from "../lib/neon/client"

async function main() {
    console.log("Testing Neon DB connection...")

    const url = process.env.DATABASE_URL
    if (!url) {
        console.error("❌ DATABASE_URL is missing from .env.local")
        return
    }

    // Safe logging of URL
    const maskedUrl = url.replace(/:([^@]+)@/, ':****@')
    console.log(`URL found: ${maskedUrl}`)

    try {
        const client = createClient()
        console.log("Client created, attempting query...")

        // Attempt simple query
        const result = await client.from("mood_entries").select("*").order("created_at", { ascending: false })

        if (result.error) {
            console.error("❌ Connection failed with error:")
            console.error(result.error)
        } else {
            console.log("✅ Connection successful!")
            console.log(`Found ${result.data?.length || 0} entries.`)

            if (result.data && result.data.length > 0) {
                console.log("Sample entry:", JSON.stringify(result.data[0], null, 2))
            }
        }
    } catch (err) {
        console.error("❌ Unexpected execution error:", err)
    }
}

main().catch(e => console.error("Top level error:", e))
