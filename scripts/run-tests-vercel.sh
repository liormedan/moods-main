#!/bin/bash
# Run tests in Vercel environment
# This script can be run via Vercel CLI or during build

set -e

echo "🧪 Running tests in Vercel environment..."
echo "============================================================"

# Check if we're in Vercel environment
if [ -n "$VERCEL" ]; then
  echo "✅ Running in Vercel environment"
else
  echo "ℹ️  Running locally (not in Vercel)"
fi

echo ""
echo "Running database tests..."
pnpm test:db

echo ""
echo "Running integration tests..."
pnpm test:integration

echo ""
echo "✅ All tests completed successfully!"

