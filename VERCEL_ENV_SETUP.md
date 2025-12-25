# הגדרת משתני סביבה ב-Vercel

## בעיות נפוצות ופתרונות

### 1. ⚠️ Clerk Development Keys Warning

**הבעיה:**
```
Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits...
```

**פתרון:**
1. היכנס ל-[Clerk Dashboard](https://dashboard.clerk.com/)
2. בחר את הפרויקט שלך
3. לך ל-API Keys
4. העתק את ה-**Production** keys (לא Test keys!)
5. ב-Vercel:
   - לך ל-Project Settings → Environment Variables
   - הוסף:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...` (לא `pk_test_...`)
     - `CLERK_SECRET_KEY` = `sk_live_...` (לא `sk_test_...`)
   - ודא שהמשתנים מוגדרים עבור **Production** environment

### 2. ⚠️ Neon Database URL Not Set

**הבעיה:**
```
Neon database URL is not set. Database features will not work.
```

**זה צפוי!** האפליקציה תעבוד גם בלי זה, אבל תכונות הדאטה בייס לא יעבדו.

**כשאתה מוכן להוסיף את Neon:**
1. היכנס ל-[Neon Console](https://console.neon.tech/)
2. צור פרויקט חדש או בחר פרויקט קיים
3. העתק את ה-Connection String
4. ב-Vercel:
   - הוסף משתנה סביבה: `DATABASE_URL` או `NEON_DATABASE_URL`
   - העתק את ה-Connection String
   - ודא שמוגדר עבור **Production** environment

### 3. ℹ️ Zustand Deprecated Warning

**הבעיה:**
```
[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`.
```

**זה לא בעיה שלנו!** האזהרה מגיעה מתלות חיצונית (כנראה `recharts`). זה לא משפיע על הפונקציונליות של האפליקציה.

---

## סיכום - מה צריך לעשות עכשיו:

### ✅ חובה (לפני פריסה ל-production):
- [ ] הגדר `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (production) ב-Vercel
- [ ] הגדר `CLERK_SECRET_KEY` (production) ב-Vercel

### 📝 אופציונלי (אפשר להוסיף מאוחר יותר):
- [ ] הגדר `DATABASE_URL` או `NEON_DATABASE_URL` ב-Vercel (כשתכין את הדאטה בייס)
- [ ] הגדר `RESEND_API_KEY` ב-Vercel (אם תרצה לשלוח אימיילים)

---

## איך להוסיף משתני סביבה ב-Vercel:

1. היכנס ל-[Vercel Dashboard](https://vercel.com/dashboard)
2. בחר את הפרויקט `moods-enter`
3. לך ל-**Settings** → **Environment Variables**
4. לחץ על **Add New**
5. הזן את השם והערך
6. בחר את ה-Environments (Production, Preview, Development)
7. לחץ **Save**
8. **חשוב:** לאחר הוספת משתנים חדשים, צריך לעשות **Redeploy** לפריסה

---

## בדיקה שהכל עובד:

לאחר הוספת משתני הסביבה:
1. לך ל-Deployments ב-Vercel
2. לחץ על ה-3 נקודות של הדיפלוי האחרון
3. בחר **Redeploy**
4. בדוק את הלוגים - האזהרות על Clerk development keys צריכות להיעלם

