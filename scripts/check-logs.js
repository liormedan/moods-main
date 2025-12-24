#!/usr/bin/env node

/**
 * סקריפט לבדיקה למה הלוגים לא מופיעים
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 [CHECK] Checking why logs are not appearing...\n');

// בדיקה 1: האם השרת רץ
console.log('1️⃣ Checking if server is running...');
console.log('   Run: pnpm dev');
console.log('   Then open: http://localhost:3000\n');

// בדיקה 2: האם הקוד מכיל לוגים
console.log('2️⃣ Checking if code contains logs...');
const loginFormPath = 'components/login-form.tsx';
if (fs.existsSync(loginFormPath)) {
  const content = fs.readFileSync(loginFormPath, 'utf-8');
  const logCount = (content.match(/console\.log/g) || []).length;
  const loginLogCount = (content.match(/\[LOGIN\]/g) || []).length;
  
  console.log(`   ✅ Login form file exists`);
  console.log(`   ✅ Found ${logCount} console.log statements`);
  console.log(`   ✅ Found ${loginLogCount} [LOGIN] logs`);
  
  if (loginLogCount === 0) {
    console.log('   ❌ ERROR: No [LOGIN] logs found!');
  }
} else {
  console.log('   ❌ Login form file not found!');
}

// בדיקה 3: האם יש .next folder (build cache)
console.log('\n3️⃣ Checking build cache...');
if (fs.existsSync('.next')) {
  console.log('   ⚠️  .next folder exists - may need to clear cache');
  console.log('   Run: Remove-Item -Recurse -Force .next');
} else {
  console.log('   ✅ No .next folder - fresh start');
}

// בדיקה 4: הוראות לבדיקה בדפדפן
console.log('\n4️⃣ Browser Console Check Instructions:');
console.log('   📋 Step-by-step:');
console.log('   1. Open browser: http://localhost:3000');
console.log('   2. Press F12 to open DevTools');
console.log('   3. Go to Console tab');
console.log('   4. Check filter settings:');
console.log('      - Should be "All levels" or "Verbose"');
console.log('      - No filters active');
console.log('   5. Refresh page (Ctrl+R)');
console.log('   6. Look for: 🔵 [LOGIN] LoginForm component loaded');
console.log('   7. Click Google button');
console.log('   8. Look for: 🔵 [LOGIN] Google button clicked!');

// בדיקה 5: בדיקת קובץ build
console.log('\n5️⃣ Checking if code is compiled...');
const nextBuildPath = '.next/server/app';
if (fs.existsSync(nextBuildPath)) {
  console.log('   ✅ Build folder exists');
  console.log('   ⚠️  If logs not appearing, try:');
  console.log('      Remove-Item -Recurse -Force .next');
  console.log('      pnpm dev');
} else {
  console.log('   ℹ️  No build folder - server may not be running');
}

console.log('\n✅ Check complete!');
console.log('\n💡 Quick Fix:');
console.log('   1. Stop server (Ctrl+C)');
console.log('   2. Remove-Item -Recurse -Force .next');
console.log('   3. pnpm dev');
console.log('   4. In browser: Ctrl+Shift+R (hard refresh)');
console.log('   5. Open Console (F12)');
console.log('   6. Check for logs');


