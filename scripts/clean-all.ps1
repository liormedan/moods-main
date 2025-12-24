# סקריפט לניקוי מלא של כל ה-cache

Write-Host "🧹 Cleaning all cache..." -ForegroundColor Yellow

# עצור את השרת אם הוא רץ
Write-Host "⏹️  Stopping server if running..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# נקה Next.js cache
Write-Host "🗑️  Removing .next folder..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next folder removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next folder doesn't exist" -ForegroundColor Gray
}

# נקה node_modules cache
Write-Host "🗑️  Removing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
    Write-Host "✅ node_modules cache removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  node_modules cache doesn't exist" -ForegroundColor Gray
}

# נקה npm cache
Write-Host "🗑️  Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "✅ npm cache cleared" -ForegroundColor Green

Write-Host ""
Write-Host "✅ All cache cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open browser DevTools (F12)" -ForegroundColor White
Write-Host "   2. Go to Application tab" -ForegroundColor White
Write-Host "   3. Clear:" -ForegroundColor White
Write-Host "      - Service Workers (Unregister all)" -ForegroundColor White
Write-Host "      - Cache Storage (Delete all)" -ForegroundColor White
Write-Host "      - Local Storage (Clear all)" -ForegroundColor White
Write-Host "   4. Close browser completely" -ForegroundColor White
Write-Host "   5. Open new browser (or incognito mode)" -ForegroundColor White
Write-Host "   6. Run: pnpm dev" -ForegroundColor White
Write-Host "   7. Go to: http://localhost:3000" -ForegroundColor White
Write-Host ""


