#!/usr/bin/env tsx
/**
 * Environment Variables Checker
 * Run this script to verify that all required environment variables are set correctly
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkEnvVar(name: string, required: boolean = true, validator?: (value: string) => boolean) {
  const value = process.env[name]
  const exists = !!value

  if (!exists) {
    if (required) {
      log(`❌ ${name}: NOT SET (REQUIRED)`, 'red')
      return false
    } else {
      log(`⚠️  ${name}: NOT SET (OPTIONAL)`, 'yellow')
      return true
    }
  }

  if (validator && !validator(value)) {
    log(`⚠️  ${name}: SET BUT INVALID`, 'yellow')
    return false
  }

  // Mask sensitive values
  const displayValue = name.includes('SECRET') || name.includes('KEY') || name.includes('PASSWORD')
    ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
    : value

  log(`✅ ${name}: SET (${displayValue})`, 'green')
  return true
}

log('\n🔍 Environment Variables Check\n', 'cyan')
log('=' .repeat(60), 'cyan')

// Required Clerk variables
log('\n📋 Clerk Authentication (REQUIRED):', 'blue')
const clerkPublishableKey = checkEnvVar('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', true, (value) => {
  if (value.startsWith('pk_test_')) {
    log('   ⚠️  WARNING: Using DEVELOPMENT key (pk_test_). Use PRODUCTION key (pk_live_) in production!', 'yellow')
    return true // Still valid, just a warning
  }
  return value.startsWith('pk_live_') || value.startsWith('pk_test_')
})

const clerkSecretKey = checkEnvVar('CLERK_SECRET_KEY', true, (value) => {
  if (value.startsWith('sk_test_')) {
    log('   ⚠️  WARNING: Using DEVELOPMENT key (sk_test_). Use PRODUCTION key (sk_live_) in production!', 'yellow')
    return true // Still valid, just a warning
  }
  return value.startsWith('sk_live_') || value.startsWith('sk_test_')
})

// Optional Neon variables
log('\n💾 Neon Database (OPTIONAL):', 'blue')
const databaseUrl = checkEnvVar('DATABASE_URL', false)
const neonDatabaseUrl = checkEnvVar('NEON_DATABASE_URL', false)

if (!databaseUrl && !neonDatabaseUrl) {
  log('   ℹ️  Database features will not work without a database URL', 'yellow')
}

// Optional Resend variables
log('\n📧 Resend Email Service (OPTIONAL):', 'blue')
const resendApiKey = checkEnvVar('RESEND_API_KEY', false, (value) => value.startsWith('re_'))

// Summary
log('\n' + '='.repeat(60), 'cyan')
log('\n📊 Summary:', 'cyan')

const allRequiredSet = clerkPublishableKey && clerkSecretKey
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
const usingDevKeys = 
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_') || 
   process.env.CLERK_SECRET_KEY?.startsWith('sk_test_'))

if (allRequiredSet) {
  if (isProduction && usingDevKeys) {
    log('\n⚠️  WARNING: You are using DEVELOPMENT keys in PRODUCTION!', 'red')
    log('   Please update your Vercel environment variables with PRODUCTION keys:', 'yellow')
    log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY should start with pk_live_', 'yellow')
    log('   - CLERK_SECRET_KEY should start with sk_live_', 'yellow')
    log('\n   Get production keys from: https://dashboard.clerk.com/', 'cyan')
    process.exit(1)
  } else {
    log('\n✅ All required environment variables are set!', 'green')
    if (usingDevKeys) {
      log('   ℹ️  Using development keys (OK for local development)', 'yellow')
    } else {
      log('   ✅ Using production keys', 'green')
    }
  }
} else {
  log('\n❌ Missing required environment variables!', 'red')
  log('   Please set the following in your .env.local file:', 'yellow')
  log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'yellow')
  log('   - CLERK_SECRET_KEY', 'yellow')
  process.exit(1)
}

if (!databaseUrl && !neonDatabaseUrl) {
  log('\nℹ️  Database URL not set - database features disabled', 'yellow')
}

log('\n', 'reset')

