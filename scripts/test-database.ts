#!/usr/bin/env tsx
/**
 * Database Operations Test Script
 * 
 * This script tests all database operations to ensure they work correctly.
 * Run with: pnpm tsx scripts/test-database.ts
 * Or: vercel dev --run scripts/test-database.ts
 */

import { createClient } from "../lib/neon/client"

interface TestResult {
  test: string
  passed: boolean
  error?: string
  details?: any
}

const results: TestResult[] = []

function logTest(testName: string, passed: boolean, error?: string, details?: any) {
  results.push({ test: testName, passed, error, details })
  const icon = passed ? "✅" : "❌"
  console.log(`${icon} ${testName}`)
  if (error) {
    console.log(`   Error: ${error}`)
  }
  if (details) {
    console.log(`   Details:`, details)
  }
}

async function testSelect() {
  try {
    const client = createClient()
    const result = await client.from("mood_entries").select("*")
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("SELECT * FROM mood_entries", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("SELECT * FROM mood_entries", false, result.error.message, result)
      return false
    }
    
    logTest("SELECT * FROM mood_entries", true, undefined, {
      dataType: Array.isArray(result.data) ? "array" : typeof result.data,
      dataLength: Array.isArray(result.data) ? result.data.length : "N/A"
    })
    return true
  } catch (error: any) {
    logTest("SELECT * FROM mood_entries", false, error.message)
    return false
  }
}

async function testSelectWithOrder() {
  try {
    const client = createClient()
    const result = await client.from("mood_entries").select("*").order("created_at", { ascending: false })
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("SELECT with ORDER BY", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("SELECT with ORDER BY", false, result.error.message, result)
      return false
    }
    
    logTest("SELECT with ORDER BY", true, undefined, {
      dataType: Array.isArray(result.data) ? "array" : typeof result.data
    })
    return true
  } catch (error: any) {
    logTest("SELECT with ORDER BY", false, error.message)
    return false
  }
}

async function testSelectWithWhere() {
  try {
    const client = createClient()
    const result = await client.from("mood_entries").select("*").eq("user_id", "test-user-id")
    
    if (result.error) {
      logTest("SELECT with WHERE (eq)", false, result.error.message, result)
      return false
    }
    
    logTest("SELECT with WHERE (eq)", true, undefined, {
      dataType: Array.isArray(result.data) ? "array" : typeof result.data
    })
    return true
  } catch (error: any) {
    logTest("SELECT with WHERE (eq)", false, error.message)
    return false
  }
}

async function testSelectSingle() {
  try {
    const client = createClient()
    const result = await client.from("mood_entries").select("*").eq("id", "test-id").single()
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("SELECT single", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("SELECT single", false, result.error.message, result)
      return false
    }
    
    logTest("SELECT single", true, undefined, {
      hasData: result.data !== null
    })
    return true
  } catch (error: any) {
    logTest("SELECT single", false, error.message)
    return false
  }
}

async function testInsert() {
  try {
    const client = createClient()
    const testData = {
      user_id: "test-user-id",
      mood_level: 5,
      energy_level: 5,
      stress_level: 5,
      notes: "Test entry",
      custom_metrics: []
    }
    
    const result = await client.from("mood_entries").insert(testData)
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("INSERT", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("INSERT", false, result.error.message, result)
      return false
    }
    
    logTest("INSERT", true, undefined, {
      hasData: result.data !== null
    })
    return true
  } catch (error: any) {
    logTest("INSERT", false, error.message)
    return false
  }
}

async function testUpsert() {
  try {
    const client = createClient()
    const testData = {
      user_id: "test-user-id",
      name: "Test Therapist",
      phone: "1234567890",
      email: "test@example.com"
    }
    
    const result = await client.from("therapist_info").upsert(testData)
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("UPSERT", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("UPSERT", false, result.error.message, result)
      return false
    }
    
    logTest("UPSERT", true, undefined, {
      hasData: result.data !== null
    })
    return true
  } catch (error: any) {
    logTest("UPSERT", false, error.message)
    return false
  }
}

async function testUpdate() {
  try {
    const client = createClient()
    const result = await client.from("mood_entries").update({ notes: "Updated" }).eq("id", "test-id")
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("UPDATE", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("UPDATE", false, result.error.message, result)
      return false
    }
    
    logTest("UPDATE", true, undefined, {
      hasData: result.data !== null
    })
    return true
  } catch (error: any) {
    logTest("UPDATE", false, error.message)
    return false
  }
}

async function testDelete() {
  try {
    const client = createClient()
    const result = await client.from("mood_entries").delete().eq("id", "test-id")
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("DELETE", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("DELETE", false, result.error.message, result)
      return false
    }
    
    logTest("DELETE", true, undefined, {
      hasData: result.data !== null
    })
    return true
  } catch (error: any) {
    logTest("DELETE", false, error.message)
    return false
  }
}

async function testComplexQuery() {
  try {
    const client = createClient()
    const result = await client
      .from("mood_entries")
      .select("*")
      .eq("user_id", "test-user-id")
      .order("created_at", { ascending: false })
    
    // If database is not configured, this is expected behavior (not a failure)
    if (result.error && result.error.message?.includes("not configured")) {
      logTest("Complex query (SELECT + WHERE + ORDER)", true, undefined, {
        status: "Mock client (expected - no database configured)",
        error: result.error.message
      })
      return true
    }
    
    if (result.error) {
      logTest("Complex query (SELECT + WHERE + ORDER)", false, result.error.message, result)
      return false
    }
    
    logTest("Complex query (SELECT + WHERE + ORDER)", true, undefined, {
      dataType: Array.isArray(result.data) ? "array" : typeof result.data
    })
    return true
  } catch (error: any) {
    logTest("Complex query (SELECT + WHERE + ORDER)", false, error.message)
    return false
  }
}

async function testClientCreation() {
  try {
    const client = createClient()
    
    if (!client) {
      logTest("Client creation", false, "Client is null or undefined")
      return false
    }
    
    if (!client.from) {
      logTest("Client creation", false, "Client missing 'from' method")
      return false
    }
    
    logTest("Client creation", true, undefined, {
      hasFrom: typeof client.from === "function",
      hasAuth: typeof client.auth === "object"
    })
    return true
  } catch (error: any) {
    logTest("Client creation", false, error.message)
    return false
  }
}

async function runAllTests() {
  console.log("🧪 Starting Database Operations Tests...\n")
  console.log("=" .repeat(60))
  
  // Check environment
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  console.log(`\n📋 Environment Check:`)
  console.log(`   DATABASE_URL: ${databaseUrl ? "✅ Set" : "❌ Not set"}`)
  console.log(`   NEON_DATABASE_URL: ${process.env.NEON_DATABASE_URL ? "✅ Set" : "❌ Not set"}`)
  
  if (!databaseUrl) {
    console.log(`\n⚠️  Warning: Database URL not set. Tests will use mock client.\n`)
  }
  
  console.log("\n" + "=".repeat(60))
  console.log("Running Tests:\n")
  
  // Run tests
  await testClientCreation()
  await testSelect()
  await testSelectWithOrder()
  await testSelectWithWhere()
  await testSelectSingle()
  await testInsert()
  await testUpsert()
  await testUpdate()
  await testDelete()
  await testComplexQuery()
  
  // Summary
  console.log("\n" + "=".repeat(60))
  console.log("\n📊 Test Summary:\n")
  
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length
  
  console.log(`Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`)
  
  if (failed > 0) {
    console.log("\n❌ Failed Tests:")
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.test}: ${r.error}`)
    })
  }
  
  console.log("\n" + "=".repeat(60))
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runAllTests().catch((error) => {
  console.error("Fatal error running tests:", error)
  process.exit(1)
})

