import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'

async function main() {
    console.log("=== DEEP DEBUG ===")

    const url = process.env.DATABASE_URL
    if (!url) {
        console.error("❌ URL missing")
        return
    }

    console.log(`URL length: ${url.length}`)
    // Print first 20 chars codes
    const chars = url.substring(0, 20).split('').map(c => c.charCodeAt(0))
    console.log("First 20 char codes:", chars.join(', '))

    // Check for spaces
    if (url.includes(' ')) {
        console.error("❌ CRITICAL: URL CONTAINS SPACES!")
    }

    try {
        console.log("Creating direct neon instance...")
        const sql = neon(url)
        console.log("Neon instance created. Executing SELECT 1...")

        const result = await sql("SELECT 1")
        console.log("Result:", result)
    } catch (err: any) {
        console.error("❌ CRASHED:", err)
        if (err.cause) console.error("Cause:", err.cause)
        if (err.stack) console.error("Stack:", err.stack)
    }
}

main()
