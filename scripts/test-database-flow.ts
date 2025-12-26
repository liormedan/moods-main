import { Pool } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function main() {
  console.log("🚀 Starting Full Database Integration Flow Test...")

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const testUserId = `test_user_integration_${Date.now()}`
  const testEmail = `test_${Date.now()}@example.com`
  let testEntryId: string | null = null

  try {
    // 0. CREATE USER (Prerequisite)
    console.log(`\n0. Creating temporary user: ${testUserId}...`)
    // Create test user for integration testing
    // If it fails, we will see the error constraints.
    await pool.query(`
      INSERT INTO users (id, email, name, created_at)
      VALUES ($1, $2, $3, NOW())
    `, [testUserId, testEmail, 'Integration Test User'])
    console.log("✅ User created successfully.")

    // 1. INSERT MOOD
    console.log(`\n1. Creating mood entry for user...`)
    const insertRes = await pool.query(`
      INSERT INTO mood_entries (user_id, mood_level, energy_level, stress_level, note)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at, mood_level
    `, [testUserId, 8, 7, 3, 'Integration Test Entry'])

    if (insertRes.rows.length === 0) throw new Error("Insert failed, no rows returned")
    testEntryId = insertRes.rows[0].id
    console.log("✅ Inserted mood successfully. ID:", testEntryId)

    // 2. READ (Verify)
    console.log(`\n2. Reading back entry ${testEntryId}...`)
    const readRes = await pool.query(`
      SELECT * FROM mood_entries WHERE id = $1
    `, [testEntryId])

    if (readRes.rows.length === 0) throw new Error("Read failed, entry not found")
    const entry = readRes.rows[0]
    console.log("✅ Read successful.")
    console.log("   Mood:", entry.mood_level)
    console.log("   Note:", entry.note)

    if (entry.mood_level !== 8) throw new Error("Read data mismatch")

    // 3. UPDATE
    console.log(`\n3. Updating entry ${testEntryId} (mood 8 -> 5)...`)
    const updateRes = await pool.query(`
      UPDATE mood_entries 
      SET mood_level = 5, note = 'Updated Note'
      WHERE id = $1
      RETURNING mood_level, note
    `, [testEntryId])

    if (updateRes.rows[0].mood_level !== 5) throw new Error("Update returned wrong value")
    console.log("✅ Update successful. New mood:", updateRes.rows[0].mood_level)

    // 4. DELETE MOOD
    console.log(`\n4. Deleting mood entry ${testEntryId}...`)
    await pool.query(`DELETE FROM mood_entries WHERE id = $1`, [testEntryId])

    const verifyDelete = await pool.query(`SELECT * FROM mood_entries WHERE id = $1`, [testEntryId])
    if (verifyDelete.rows.length > 0) throw new Error("Delete mood failed")
    console.log("✅ Delete mood successful.")

    // 5. DELETE USER (Cleanup)
    console.log(`\n5. Deleting temporary user ${testUserId}...`)
    await pool.query(`DELETE FROM users WHERE id = $1`, [testUserId])
    console.log("✅ Delete user successful. Cleanup complete.")

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error)
    // Attempt cleanup if possible
    if (testUserId) {
      try {
        console.log("Attempting emergency cleanup...")
        if (testEntryId) await pool.query(`DELETE FROM mood_entries WHERE id = $1`, [testEntryId])
        await pool.query(`DELETE FROM users WHERE id = $1`, [testUserId])
        console.log("Emergency cleanup done.")
      } catch (e) {
        console.error("Cleanup failed:", e)
      }
    }
  } finally {
    await pool.end()
  }
}

main()
