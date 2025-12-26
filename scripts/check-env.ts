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

log('\n✅ Environment check complete!', 'green')

if (!databaseUrl && !neonDatabaseUrl) {
  log('\nℹ️  Database URL not set - database features disabled', 'yellow')
}

log('\n', 'reset')


