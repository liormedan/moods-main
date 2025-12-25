// Neon Database Client
// TODO: Replace with actual Neon client when database is set up
// For now, this is a placeholder that won't crash the app

export function createClient() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL

  // Return mock client if env vars are missing
  if (!databaseUrl) {
    console.warn("Neon database URL is not set. Database features will not work.")
    return createMockClient()
  }

  // TODO: Initialize actual Neon client here
  // Example: import { neon } from '@neondatabase/serverless'
  // return neon(databaseUrl)
  
  console.warn("Neon client not yet implemented. Using mock client.")
  return createMockClient()
}

// Mock client factory - returns a client that won't crash but won't work
function createMockClient() {
  const mockQuery = {
    select: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
    insert: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
    update: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
    delete: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
    upsert: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
    order: function(this: any) {
      return {
        select: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
      }
    },
    eq: function(this: any) {
      return {
        select: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
        single: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
        upsert: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
        order: () => ({
          select: () => Promise.resolve({ data: null, error: { message: "Neon database not configured" } }),
        }),
      }
    },
  }

  return {
    from: () => mockQuery,
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as any
}

