# MOODS - לניהול מצבי רוח

אפליקציה לניהול ומעקב אחר מצבי רוח יומיים.

## תכונות

- 📊 מעקב יומי אחר מצב רוח, אנרגיה ולחץ
- 📈 ניתוחים וגרפים של מגמות
- 📝 הערות אישיות
- 📧 שליחת מיילים (אופציונלי)
- 🎨 ממשק משתמש מודרני וידידותי

## התקנה

```bash
pnpm install
```

## פיתוח

```bash
pnpm dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

## משתני סביבה

ראה `env.example` לדוגמה של משתני סביבה נדרשים.

### אופציונלי:
- `DATABASE_URL` או `NEON_DATABASE_URL` - חיבור למסד נתונים Neon
- `RESEND_API_KEY` - מפתח API לשליחת מיילים

## פריסה

הפרויקט מוכן לפריסה ב-Vercel.

ראה `VERCEL_ENV_SETUP.md` להוראות מפורטות להגדרת משתני סביבה ב-Vercel.

## טכנולוגיות

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Neon Database (אופציונלי)
- Resend (אופציונלי)
