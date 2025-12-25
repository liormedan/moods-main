#!/bin/bash
# Database Operations Test Script (Shell version for Vercel CLI)
# Run with: vercel dev --run scripts/test-database.sh
# Or: bash scripts/test-database.sh

echo "🧪 Starting Database Operations Tests..."
echo "============================================================"

# Check environment
echo ""
echo "📋 Environment Check:"
if [ -z "$DATABASE_URL" ] && [ -z "$NEON_DATABASE_URL" ]; then
    echo "   ❌ DATABASE_URL: Not set"
    echo "   ❌ NEON_DATABASE_URL: Not set"
    echo ""
    echo "⚠️  Warning: Database URL not set. Tests will use mock client."
else
    if [ -n "$DATABASE_URL" ]; then
        echo "   ✅ DATABASE_URL: Set"
    fi
    if [ -n "$NEON_DATABASE_URL" ]; then
        echo "   ✅ NEON_DATABASE_URL: Set"
    fi
fi

echo ""
echo "============================================================"
echo ""
echo "Running TypeScript test script..."
echo ""

# Run the TypeScript test script
pnpm tsx scripts/test-database.ts

EXIT_CODE=$?

echo ""
echo "============================================================"
echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed!"
fi

exit $EXIT_CODE

