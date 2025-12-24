#!/usr/bin/env node

/**
 * סקריפט בדיקה אוטומטי לתהליך התחברות Google
 * מריץ בדיקות על הקבצים וההגדרות
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 [TEST] Starting Google Auth Automated Test');
console.log('🧪 [TEST] =========================================\n');

const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// Helper function to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

// Test 1: Check if required files exist
console.log('📁 Test 1: Checking required files...');
const requiredFiles = [
  'components/login-form.tsx',
  'components/signup-form.tsx',
  'app/auth/callback/route.ts',
  'app/page.tsx',
  'app/login/page.tsx',
  'app/signup/page.tsx',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'middleware.ts'
];

requiredFiles.forEach(file => {
  if (fileExists(file)) {
    results.passed.push(`✅ File exists: ${file}`);
  } else {
    results.failed.push(`❌ File missing: ${file}`);
  }
});

// Test 2: Check environment variables
console.log('\n🔐 Test 2: Checking environment variables...');
const envLocalPath = '.env.local';
const envExamplePath = '.env.example';

if (fileExists(envLocalPath)) {
  const envContent = readFile(envLocalPath);
  if (envContent) {
    const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
    const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    if (hasSupabaseUrl && hasSupabaseKey) {
      // Check if values are set (not empty)
      const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
      const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
      
      if (urlMatch && urlMatch[1] && urlMatch[1].trim() && !urlMatch[1].includes('your_')) {
        results.passed.push('✅ NEXT_PUBLIC_SUPABASE_URL is set');
      } else {
        results.failed.push('❌ NEXT_PUBLIC_SUPABASE_URL is missing or empty');
      }
      
      if (keyMatch && keyMatch[1] && keyMatch[1].trim() && !keyMatch[1].includes('your_')) {
        results.passed.push('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
      } else {
        results.failed.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty');
      }
    } else {
      results.failed.push('❌ Missing Supabase environment variables');
    }
  }
} else {
  results.failed.push('❌ .env.local file not found');
}

if (fileExists(envExamplePath)) {
  results.passed.push('✅ .env.example file exists');
} else {
  results.warnings.push('⚠️  .env.example file not found');
}

// Test 3: Check login-form.tsx for required code
console.log('\n📝 Test 3: Checking login-form.tsx code...');
const loginFormPath = 'components/login-form.tsx';
if (fileExists(loginFormPath)) {
  const loginContent = readFile(loginFormPath);
  
  if (loginContent) {
    // Check for detailed logs
    if (loginContent.includes('🔵 [LOGIN]')) {
      results.passed.push('✅ Login form has detailed logs');
    } else {
      results.failed.push('❌ Login form missing detailed logs');
    }
    
    // Check for useEffect import
    if (loginContent.includes("import { useState, useEffect }")) {
      results.passed.push('✅ Login form imports useEffect');
    } else {
      results.failed.push('❌ Login form missing useEffect import');
    }
    
    // Check for handleGoogleLogin function
    if (loginContent.includes('handleGoogleLogin')) {
      results.passed.push('✅ Login form has handleGoogleLogin function');
      
      // Check for redirectTo with window.location.origin
      if (loginContent.includes('window.location.origin') && loginContent.includes('redirectTo')) {
        results.passed.push('✅ Login form uses window.location.origin for redirect');
      } else {
        results.failed.push('❌ Login form not using window.location.origin for redirect');
      }
      
      // Check for detailed logging in handleGoogleLogin
      if (loginContent.includes('Google Login - Starting OAuth flow')) {
        results.passed.push('✅ Login form has detailed OAuth logging');
      } else {
        results.failed.push('❌ Login form missing detailed OAuth logging');
      }
    } else {
      results.failed.push('❌ Login form missing handleGoogleLogin function');
    }
    
    // Check for button onClick with logging
    if (loginContent.includes('Google button clicked!')) {
      results.passed.push('✅ Login form button has click logging');
    } else {
      results.failed.push('❌ Login form button missing click logging');
    }
  }
}

// Test 4: Check signup-form.tsx for required code
console.log('\n📝 Test 4: Checking signup-form.tsx code...');
const signupFormPath = 'components/signup-form.tsx';
if (fileExists(signupFormPath)) {
  const signupContent = readFile(signupFormPath);
  
  if (signupContent) {
    // Check for detailed logs
    if (signupContent.includes('🟣 [SIGNUP]')) {
      results.passed.push('✅ Signup form has detailed logs');
    } else {
      results.failed.push('❌ Signup form missing detailed logs');
    }
    
    // Check for useEffect import
    if (signupContent.includes("import { useState, useEffect }")) {
      results.passed.push('✅ Signup form imports useEffect');
    } else {
      results.failed.push('❌ Signup form missing useEffect import');
    }
    
    // Check for handleGoogleSignup function
    if (signupContent.includes('handleGoogleSignup')) {
      results.passed.push('✅ Signup form has handleGoogleSignup function');
      
      // Check for redirectTo with window.location.origin
      if (signupContent.includes('window.location.origin') && signupContent.includes('redirectTo')) {
        results.passed.push('✅ Signup form uses window.location.origin for redirect');
      } else {
        results.failed.push('❌ Signup form not using window.location.origin for redirect');
      }
    } else {
      results.failed.push('❌ Signup form missing handleGoogleSignup function');
    }
  }
}

// Test 5: Check callback route
console.log('\n📝 Test 5: Checking callback route...');
const callbackPath = 'app/auth/callback/route.ts';
if (fileExists(callbackPath)) {
  const callbackContent = readFile(callbackPath);
  
  if (callbackContent) {
    // Check for detailed logs
    if (callbackContent.includes('🟡 [CALLBACK]')) {
      results.passed.push('✅ Callback route has detailed logs');
    } else {
      results.failed.push('❌ Callback route missing detailed logs');
    }
    
    // Check for error handling
    if (callbackContent.includes('errorParam') || callbackContent.includes('errorCode')) {
      results.passed.push('✅ Callback route handles errors');
    } else {
      results.failed.push('❌ Callback route missing error handling');
    }
    
    // Check for code exchange
    if (callbackContent.includes('exchangeCodeForSession')) {
      results.passed.push('✅ Callback route exchanges code for session');
    } else {
      results.failed.push('❌ Callback route missing code exchange');
    }
    
    // Check for user verification
    if (callbackContent.includes('getUser')) {
      results.passed.push('✅ Callback route verifies user');
    } else {
      results.failed.push('❌ Callback route missing user verification');
    }
    
    // Check for development/production handling
    if (callbackContent.includes('NODE_ENV') || callbackContent.includes('development')) {
      results.passed.push('✅ Callback route handles development/production');
    } else {
      results.warnings.push('⚠️  Callback route may not handle development/production correctly');
    }
  }
}

// Test 6: Check redirect URLs in code
console.log('\n🔗 Test 6: Checking redirect URLs...');
const allFiles = [
  { path: 'components/login-form.tsx', name: 'Login Form' },
  { path: 'components/signup-form.tsx', name: 'Signup Form' },
  { path: 'app/auth/callback/route.ts', name: 'Callback Route' }
];

allFiles.forEach(file => {
  if (fileExists(file.path)) {
    const content = readFile(file.path);
    if (content) {
      // Check for hardcoded production URLs
      if (content.includes('v0-login-01-sigma-two.vercel.app')) {
        results.warnings.push(`⚠️  ${file.name} contains hardcoded production URL`);
      }
      
      // Check for localhost redirect (different for server-side routes)
      if (file.path === 'app/auth/callback/route.ts') {
        // Server-side route uses origin from request, not window.location
        if (content.includes('origin') && (content.includes('hostname') || content.includes('isLocalhost'))) {
          results.passed.push(`✅ ${file.name} supports localhost redirect (server-side)`);
        } else {
          results.warnings.push(`⚠️  ${file.name} may not support localhost redirect`);
        }
      } else if (content.includes('localhost:3000') || content.includes('window.location.origin')) {
        results.passed.push(`✅ ${file.name} supports localhost redirect`);
      } else {
        results.warnings.push(`⚠️  ${file.name} may not support localhost redirect`);
      }
      
      // Check for /auth/callback path (not needed for callback route itself)
      if (file.path === 'app/auth/callback/route.ts') {
        // Callback route doesn't need to contain the path, it IS the path
        results.passed.push(`✅ ${file.name} is the callback route (path is correct by location)`);
      } else if (content.includes('/auth/callback')) {
        results.passed.push(`✅ ${file.name} uses /auth/callback path`);
      } else {
        results.failed.push(`❌ ${file.name} missing /auth/callback path`);
      }
      
      // Check for localhost support in callback route
      if (file.path === 'app/auth/callback/route.ts') {
        if (content.includes('isLocalhost') || content.includes('localhost') || content.includes('hostname')) {
          results.passed.push(`✅ ${file.name} supports localhost detection`);
        } else {
          results.warnings.push(`⚠️  ${file.name} may not detect localhost correctly`);
        }
      }
    }
  }
});

// Test 7: Check for login and signup pages
console.log('\n📄 Test 7: Checking login/signup pages...');
if (fileExists('app/login/page.tsx')) {
  results.passed.push('✅ Login page exists');
} else {
  results.failed.push('❌ Login page missing');
}

if (fileExists('app/signup/page.tsx')) {
  results.passed.push('✅ Signup page exists');
} else {
  results.failed.push('❌ Signup page missing');
}

// Test 8: Check middleware
console.log('\n🛡️  Test 8: Checking middleware...');
if (fileExists('middleware.ts')) {
  const middlewareContent = readFile('middleware.ts');
  if (middlewareContent && middlewareContent.includes('updateSession')) {
    results.passed.push('✅ Middleware exists and uses updateSession');
  } else {
    results.failed.push('❌ Middleware missing or incorrect');
  }
} else {
  results.failed.push('❌ Middleware file missing');
}

// Test 9: Check Supabase client files
console.log('\n🔧 Test 9: Checking Supabase client files...');
if (fileExists('lib/supabase/client.ts')) {
  const clientContent = readFile('lib/supabase/client.ts');
  if (clientContent && clientContent.includes('createBrowserClient')) {
    results.passed.push('✅ Supabase client file exists and uses createBrowserClient');
  } else {
    results.failed.push('❌ Supabase client file incorrect');
  }
} else {
  results.failed.push('❌ Supabase client file missing');
}

if (fileExists('lib/supabase/server.ts')) {
  const serverContent = readFile('lib/supabase/server.ts');
  if (serverContent && serverContent.includes('createServerClient')) {
    results.passed.push('✅ Supabase server file exists and uses createServerClient');
  } else {
    results.failed.push('❌ Supabase server file incorrect');
  }
} else {
  results.failed.push('❌ Supabase server file missing');
}

// Print results
console.log('\n📊 Test Results Summary');
console.log('=========================================');
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log('\n');

if (results.passed.length > 0) {
  console.log('✅ Passed Tests:');
  results.passed.forEach(test => console.log(`   ${test}`));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('⚠️  Warnings:');
  results.warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

if (results.failed.length > 0) {
  console.log('❌ Failed Tests:');
  results.failed.forEach(test => console.log(`   ${test}`));
  console.log('');
}

// Overall status
const totalTests = results.passed.length + results.failed.length;
const passRate = totalTests > 0 ? (results.passed.length / totalTests * 100).toFixed(1) : 0;

console.log('📈 Overall Status:');
console.log(`   Pass Rate: ${passRate}%`);
console.log(`   Total Tests: ${totalTests}`);

if (results.failed.length === 0 && results.warnings.length === 0) {
  console.log('\n🎉 All tests passed! Everything looks good.');
} else if (results.failed.length === 0) {
  console.log('\n✅ All critical tests passed! Some warnings to review.');
} else {
  console.log('\n⚠️  Some tests failed. Please review and fix the issues above.');
}

console.log('\n🧪 [TEST] =========================================');
console.log('🧪 [TEST] Test completed');

