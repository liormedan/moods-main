# Database Test Script

## Overview

This project includes a comprehensive test script for all database operations. The script tests all CRUD operations and query methods to ensure the database client works correctly.

## Running Tests

### Local Development

```bash
# Install dependencies (if not already installed)
pnpm install

# Run the test script
pnpm test:db
```

### Vercel CLI

```bash
# Run tests via Vercel CLI
vercel dev --run pnpm test:db

# Or run the shell script directly
vercel dev --run bash scripts/test-database.sh
```

### Direct Execution

```bash
# Using tsx directly
pnpm tsx scripts/test-database.ts

# Or using node (if tsx is globally installed)
tsx scripts/test-database.ts
```

## What Gets Tested

The test script checks the following database operations:

1. ✅ **Client Creation** - Verifies the client can be created
2. ✅ **SELECT** - Basic select queries
3. ✅ **SELECT with ORDER BY** - Ordered queries
4. ✅ **SELECT with WHERE** - Filtered queries using `eq()`
5. ✅ **SELECT single** - Single record retrieval
6. ✅ **INSERT** - Creating new records
7. ✅ **UPSERT** - Insert or update records
8. ✅ **UPDATE** - Updating existing records
9. ✅ **DELETE** - Deleting records
10. ✅ **Complex Queries** - Combined SELECT + WHERE + ORDER

## Environment Variables

The script checks for these environment variables:

- `DATABASE_URL` - Primary database connection string
- `NEON_DATABASE_URL` - Alternative Neon database URL

If neither is set, the script will use the mock client (which is expected behavior during development).

## Expected Output

When running the tests, you'll see:

```
🧪 Starting Database Operations Tests...
============================================================

📋 Environment Check:
   DATABASE_URL: ✅ Set (or ❌ Not set)
   NEON_DATABASE_URL: ✅ Set (or ❌ Not set)

============================================================
Running Tests:

✅ Client creation
✅ SELECT * FROM mood_entries
✅ SELECT with ORDER BY
✅ SELECT with WHERE (eq)
✅ SELECT single
✅ INSERT
✅ UPSERT
✅ UPDATE
✅ DELETE
✅ Complex query (SELECT + WHERE + ORDER)

============================================================

📊 Test Summary:

Total Tests: 10
✅ Passed: 10
❌ Failed: 0
Success Rate: 100%
```

## Notes

- The script is designed to work with both real database connections and mock clients
- When using a mock client (no DATABASE_URL set), all tests will pass but won't actually interact with a database
- The script exits with code 0 on success, 1 on failure (useful for CI/CD)

## Troubleshooting

If tests fail:

1. Check that environment variables are set correctly
2. Verify database connection string format
3. Ensure database is accessible from your network
4. Check that the database client implementation matches expected API

