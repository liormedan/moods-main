import { Pool } from '@neondatabase/serverless'

// Track warning state
let hasWarnedAboutDatabase = false

// Singleton pool instance
let pool: Pool | null = null

export function createClient() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL

  if (!databaseUrl) {
    if (!hasWarnedAboutDatabase && typeof window !== 'undefined') {
      hasWarnedAboutDatabase = true
      console.warn("Neon database URL is not set. Database features will not work.")
    }
    return createMockClient()
  }

  // Initialize singleton pool if not exists
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl })
  }

  return {
    from: (table: string) => {
      let type = 'SELECT' // SELECT, INSERT, UPSERT, UPDATE, DELETE
      let columns = '*'
      let orderBy = ''

      let whereClauses: { col: string, val: any }[] = []
      let dataObject: any = null

      const builder = {
        select: (cols: string = '*') => {
          type = 'SELECT'
          columns = cols
          return builder
        },

        eq: (col: string, val: any) => {
          whereClauses.push({ col, val })
          return builder
        },

        order: (col: string, { ascending = true }: { ascending?: boolean } = {}) => {
          const safeCol = col.replace(/[^a-zA-Z0-9_]/g, '')
          orderBy = ` ORDER BY ${safeCol} ${ascending ? 'ASC' : 'DESC'}`
          return builder
        },

        insert: (data: any) => {
          type = 'INSERT'
          dataObject = data
          return builder
        },

        upsert: (data: any) => {
          type = 'UPSERT'
          dataObject = data
          return builder
        },

        update: (data: any) => {
          type = 'UPDATE'
          dataObject = data
          return builder
        },

        delete: () => {
          type = 'DELETE'
          return builder
        },

        single: () => {
          // Mock single support by just returning builder, we handle logic in result or limit 1
          return builder
        },

        then: (resolve: (value: any) => void, reject: (reason: any) => void) => {
          let sql = ''
          let params: any[] = []

          // Use the singleton pool
          if (!pool) {
            resolve({ data: null, error: { message: "Database connection failed" } })
            return
          }

          try {
            if (type === 'SELECT') {
              const safeColumns = columns === '*' ? '*' : columns.split(',').map(c => c.trim().replace(/[^a-zA-Z0-9_]/g, '')).join(', ')

              sql = `SELECT ${safeColumns} FROM ${table}`

              if (whereClauses.length) {
                const whereParts = whereClauses.map((w, i) => `${w.col} = $${i + 1}`)
                sql += ` WHERE ${whereParts.join(' AND ')}`
                params = whereClauses.map(w => w.val)
              }
              sql += orderBy

            } else if ((type === 'INSERT' || type === 'UPSERT') && dataObject) {
              const keys = Object.keys(dataObject)
              const vals = Object.values(dataObject)
              const safeKeys = keys.map(k => k.replace(/[^a-zA-Z0-9_]/g, ''))
              const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ')

              params = vals

              if (type === 'INSERT') {
                sql = `INSERT INTO ${table} (${safeKeys.join(', ')}) VALUES (${placeholders}) RETURNING *`
              } else { // UPSERT
                const updateSet = safeKeys.map((k) => `${k} = EXCLUDED.${k}`).join(', ')
                sql = `INSERT INTO ${table} (${safeKeys.join(', ')}) VALUES (${placeholders}) 
                               ON CONFLICT (id) DO UPDATE SET ${updateSet} RETURNING *`
              }

            } else if (type === 'UPDATE' && dataObject) {
              const keys = Object.keys(dataObject)
              const vals = Object.values(dataObject)
              const safeKeys = keys.map(k => k.replace(/[^a-zA-Z0-9_]/g, ''))

              // Params: [...dataVals, ...whereVals]
              const setParts = safeKeys.map((k, i) => `${k} = $${i + 1}`)
              params = [...vals, ...whereClauses.map(w => w.val)]

              sql = `UPDATE ${table} SET ${setParts.join(', ')}`

              if (whereClauses.length) {
                // Where params start after data params
                const whereParts = whereClauses.map((w, i) => `${w.col} = $${vals.length + i + 1}`)
                sql += ` WHERE ${whereParts.join(' AND ')}`
              }

              sql += " RETURNING *"

            } else if (type === 'DELETE') {
              sql = `DELETE FROM ${table}`
              if (whereClauses.length) {
                const whereParts = whereClauses.map((w, i) => `${w.col} = $${i + 1}`)
                sql += ` WHERE ${whereParts.join(' AND ')}`
                params = whereClauses.map(w => w.val)
              }
            } else {
              resolve({ data: null, error: { message: "Invalid query type or missing data" } })
              return
            }

            // Execute
            pool.query(sql, params)
              .then(res => {
                resolve({ data: res.rows, error: null })
                // Do NOT close the pool here (serverless singleton)
              })
              .catch(err => {
                console.error("DB Error:", err)
                resolve({ data: null, error: err })
                // Do NOT close the pool here
              })

          } catch (err) {
            console.error("Builder Error:", err)
            resolve({ data: null, error: err })
            // Do NOT close the pool here
          }
        }
      }
      return builder
    }
  }
}

function createMockClient() {
  const mockResult = Promise.resolve({ data: null, error: { message: "Neon database not configured" } })
  const mockBuilder = {
    select: () => mockBuilder,
    eq: () => mockBuilder,
    order: () => mockBuilder,
    insert: () => mockBuilder,
    upsert: () => mockBuilder,
    update: () => mockBuilder,
    delete: () => mockBuilder,
    single: () => mockBuilder,
    then: (resolve: any) => resolve({ data: null, error: { message: "Neon database not configured" } })
  }

  return {
    from: () => mockBuilder
  }
}
