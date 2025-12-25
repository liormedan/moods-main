# הרצת בדיקות דרך Vercel

## סקירה כללית

הפרויקט כולל שני סקריפטי בדיקה שניתן להריץ דרך Vercel:

1. **`test:db`** - בדיקת פעולות דאטה בייס בסיסיות
2. **`test:integration`** - בדיקת אינטגרציה מלאה (Clerk + דאטה בייס + קומפוננטים)

## דרכים להריץ בדיקות דרך Vercel

### 1. הרצה מקומית עם Vercel CLI

```bash
# הרצת כל הבדיקות
pnpm test:all

# או כל בדיקה בנפרד
pnpm test:db
pnpm test:integration
```

### 2. הרצה דרך Vercel Build (אוטומטי)

הבדיקות ירוצו אוטומטית בכל deployment ב-Vercel דרך ה-`vercel-build` script.

**הגדרה ב-`vercel.json`:**
```json
{
  "buildCommand": "pnpm run vercel-build"
}
```

**הגדרה ב-`package.json`:**
```json
{
  "scripts": {
    "vercel-build": "pnpm test:all && pnpm run build"
  }
}
```

### 3. הרצה דרך Vercel Dev Environment

```bash
# Terminal 1: התחל Vercel dev server
vercel dev

# Terminal 2: הרץ בדיקות
pnpm test:all
```

### 4. בדיקה מקומית של Build Process

```bash
# סימולציה של מה שיקרה ב-Vercel
pnpm run vercel-build
```

## מה הבדיקות בודקות

### בדיקת דאטה בייס (`test:db`)
- ✅ יצירת client
- ✅ SELECT queries
- ✅ SELECT with ORDER BY
- ✅ SELECT with WHERE
- ✅ SELECT single
- ✅ INSERT
- ✅ UPDATE
- ✅ DELETE
- ✅ UPSERT
- ✅ שאילתות מורכבות

### בדיקת אינטגרציה (`test:integration`)
- ✅ הגדרת Clerk
- ✅ טעינת mood entries למשתמש
- ✅ יצירת mood entry (כמו MoodTrackerForm)
- ✅ טעינת נתוני analytics (כמו AnalyticsTab)
- ✅ חישוב סטטיסטיקות dashboard (כמו DashboardOverview)
- ✅ פעולות therapist info (כמו EmergencyContactTab)
- ✅ פעולות settings (כמו SettingsTab)
- ✅ היסטוריית הערות (כמו NotesHistory)

## משתני סביבה נדרשים

### לבדיקות בסיסיות (mock client):
- אין צורך במשתני סביבה - הבדיקות יעבדו עם mock client

### לבדיקות מלאות (עם דאטה בייס אמיתי):
- `DATABASE_URL` או `NEON_DATABASE_URL` - כתובת מסד הנתונים
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - מפתח Clerk פומבי
- `CLERK_SECRET_KEY` - מפתח Clerk סודי

## הוספת משתני סביבה ב-Vercel

1. לך ל-Vercel Dashboard
2. בחר את הפרויקט
3. Settings → Environment Variables
4. הוסף את המשתנים הנדרשים

## תוצאות צפויות

### עם mock client (ללא דאטה בייס):
```
✅ כל הבדיקות יעברו
✅ Success Rate: 100%
ℹ️  הבדיקות משתמשות ב-mock client (התנהגות צפויה)
```

### עם דאטה בייס אמיתי:
```
✅ כל הבדיקות יעברו
✅ Success Rate: 100%
✅ הבדיקות משתמשות בדאטה בייס אמיתי
```

## פתרון בעיות

### הבדיקות נכשלות ב-Vercel build:
1. בדוק שמשתני הסביבה מוגדרים ב-Vercel Dashboard
2. בדוק שה-`vercel-build` script מוגדר נכון
3. בדוק את ה-logs ב-Vercel Dashboard → Deployments → [deployment] → Build Logs

### הבדיקות איטיות:
- זה נורמלי - הבדיקות בודקות הרבה פעולות
- ב-production, הבדיקות ירוצו רק בזמן build

## הערות

- הבדיקות לא משנות נתונים בדאטה בייס (אם יש)
- הבדיקות משתמשות ב-test data
- לבדיקות E2E מלאות, השתמש ב-Playwright או Cypress

