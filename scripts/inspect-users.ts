import { Pool } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    try {
        const res = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `)
        console.log("Schema for users:", res.rows)
    } catch (e) {
        console.error(e)
    } finally {
        await pool.end()
    }
}

main()
