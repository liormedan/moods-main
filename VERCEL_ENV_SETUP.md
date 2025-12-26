# הגדרת משתני סביבה ב-Vercel

## בעיות נפוצות ופתרונות

### 1. ⚠️ Neon Database URL Not Set

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

### 2. ℹ️ Zustand Deprecated Warning

**הבעיה:**
```
[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`.
```

**זה לא בעיה שלנו!** האזהרה מגיעה מתלות חיצונית (כנראה `recharts`). זה לא משפיע על הפונקציונליות של האפליקציה.

---

## סיכום - מה צריך לעשות עכשיו:

### 📝 אופציונלי (אפשר להוסיף מאוחר יותר):
- [ ] הגדר `DATABASE_URL` או `NEON_DATABASE_URL` ב-Vercel (כשתכין את הדאטה בייס)
- [ ] הגדר `RESEND_API_KEY` ב-Vercel (אם תרצה לשלוח אימיילים)

---

## בדיקת משתני סביבה

לפני פריסה, תוכל לבדוק את משתני הסביבה עם הסקריפט:

```bash
pnpm run check:env
```

הסקריפט יבדוק:
- ℹ️ האם משתנים אופציונליים מוגדרים (Database, Resend)

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
4. בדוק את הלוגים - האפליקציה אמורה לעבוד ללא שגיאות

