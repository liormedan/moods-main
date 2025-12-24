# Clerk CLI - מדריך שימוש

## ⚠️ הערה חשובה

**Clerk לא מספק CLI רשמי לניהול אפליקציות** כמו Supabase או Firebase.

הניהול של Clerk נעשה דרך:
1. **Clerk Dashboard** - ממשק וובי: https://dashboard.clerk.com
2. **Clerk API** - דרך REST API או SDK

## כלי CLI זמינים של Clerk

### 1. `@clerk/dev-cli` - כלי פיתוח
כלי לפיתוח חבילות Clerk (לא לניהול אפליקציות):

```powershell
npm install --global @clerk/dev-cli
```

### 2. `@clerk/upgrade` - כלי שדרוג
כלי לסיוע בשדרוג SDK:

```powershell
npx @clerk/upgrade --from=core-1
```

## ניהול דרך Clerk Dashboard

**קישור:** https://dashboard.clerk.com

רוב הפעולות נעשות דרך Clerk Dashboard:

### פעולות נפוצות:

1. **ניהול משתמשים**
   - Dashboard → Users
   - יצירה, עריכה, מחיקה של משתמשים
   - בדיקת פעילות משתמשים

2. **הגדרת OAuth Providers**
   - Dashboard → Configure → SSO connections
   - הוספת Google, GitHub, Microsoft וכו'

3. **ניהול API Keys**
   - Dashboard → API Keys
   - יצירת keys חדשים
   - העתקת keys ל-`.env.local`

4. **בדיקת Logs**
   - Dashboard → Logs
   - מעקב אחר שגיאות ואירועים

5. **הגדרת Environment Variables**
   - Dashboard → Settings → Environment Variables
   - או העתקה ידנית מ-Dashboard ל-`.env.local`

## ניהול דרך API

אפשר גם לנהל דרך Clerk API:

```typescript
import { clerkClient } from '@clerk/nextjs/server'

// יצירת משתמש
const user = await clerkClient.users.createUser({
  emailAddress: ['user@example.com'],
  password: 'password123',
})

// רשימת משתמשים
const users = await clerkClient.users.getUserList()
```

**תיעוד API:** https://clerk.com/docs/reference/backend-api

---

**נוצר:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")


