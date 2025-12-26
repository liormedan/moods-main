# פריסה מלאה ב-Railway (Frontend + Backend)

## אפשרויות פריסה

### אפשרות 1: הכל ב-Railway (Frontend + Backend) 🚀

**יתרונות:**
- הכל במקום אחד
- קל לניהול
- משתני סביבה משותפים
- פריסה אוטומטית מ-Git

**חסרונות:**
- Vercel טוב יותר ל-Next.js (optimization, CDN, וכו')
- עלויות יכולות להיות גבוהות יותר

---

### אפשרות 2: Frontend ב-Vercel, Backend ב-Railway (מומלץ) ⭐

**יתרונות:**
- Vercel מותאם ל-Next.js (CDN, edge functions, וכו')
- Railway מותאם ל-FastAPI
- כל פלטפורמה עושה מה שהיא הכי טובה בו
- חינמי (עד גבולות מסוימים)

**חסרונות:**
- שני שירותים נפרדים לניהול

---

## איך להעלות הכל ב-Railway

### שלב 1: הכנת הפרויקט

#### 1.1 יצירת `railway.json` (אופציונלי)

צור קובץ `railway.json` בשורש הפרויקט:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 1.2 עדכון `package.json` (אם צריך)

ודא שיש לך scripts נכונים:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

---

### שלב 2: פריסת Backend ב-Railway

1. היכנס ל-[Railway.app](https://railway.app)
2. לחץ על "New Project"
3. בחר "Deploy from GitHub repo"
4. בחר את ה-repository שלך
5. Railway יזהה אוטומטית את תיקיית `backend/`
6. אם לא, הגדר:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

#### משתני סביבה ל-Backend:

```
FIREBASE_SERVICE_ACCOUNT_JSON=<הדבק את כל ה-JSON כאן>
FIREBASE_PROJECT_ID=moods-firebase-1a211
SECRET_KEY=<מפתח סודי חזק>
PROJECT_NAME=Moods Enter API
API_V1_STR=/api/v1
```

**הערה:** עבור `FIREBASE_SERVICE_ACCOUNT_JSON`, הדבק את כל התוכן של קובץ ה-JSON (ללא שורות, כשורה אחת).

---

### שלב 3: פריסת Frontend ב-Railway

1. באותו Project, לחץ על "New Service"
2. בחר "GitHub Repo" שוב
3. בחר את אותו repository
4. הפעם, הגדר:
   - **Root Directory**: `.` (שורש הפרויקט)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Port**: Railway יזהה אוטומטית

#### משתני סביבה ל-Frontend:

```
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app/api/v1
NODE_ENV=production
```

**חשוב:** החלף `your-backend-service` ב-URL האמיתי של ה-backend service ב-Railway.

---

## איך למצוא את ה-URL של ה-Backend ב-Railway

1. לחץ על ה-Backend service
2. לחץ על "Settings"
3. תחת "Domains", תראה את ה-URL
4. או תחת "Networking", תראה את ה-Port וה-URL

**דוגמה:**
```
Backend URL: https://backend-production.up.railway.app
Frontend צריך: NEXT_PUBLIC_API_URL=https://backend-production.up.railway.app/api/v1
```

---

## מבנה ב-Railway

```
Railway Project: moods-enter
├── Service 1: backend (FastAPI)
│   ├── Port: 8000 (אוטומטי)
│   ├── URL: https://backend-production.up.railway.app
│   └── Environment Variables: Firebase, SECRET_KEY, וכו'
│
└── Service 2: frontend (Next.js)
    ├── Port: 3000 (אוטומטי)
    ├── URL: https://frontend-production.up.railway.app
    └── Environment Variables: NEXT_PUBLIC_API_URL
```

---

## עדכון CORS ב-Backend

אחרי שתדע את ה-URL של ה-Frontend, עדכן את `backend/app/main.py`:

```python
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://frontend-production.up.railway.app",  # הוסף את ה-URL של ה-Frontend
    "https://your-vercel-app.vercel.app"  # אם תעבור ל-Vercel אחר כך
]
```

---

## פריסה אוטומטית

Railway מפריס אוטומטית כל push ל-`main` branch.

**לבדיקה:**
1. עשה push ל-GitHub
2. Railway יזהה ויבנה מחדש
3. בדוק את ה-logs ב-Railway dashboard

---

## עלויות

**Railway:**
- חינמי עד $5/חודש
- $5/חודש = 500 שעות compute
- כל service = compute נפרד

**אם תעלה Frontend + Backend:**
- 2 services = כפול ה-compute
- עדיין חינמי עד $5/חודש (אם לא עוברים את הגבול)

---

## המלצה

**להתחלה:** הכל ב-Railway - קל ופשוט

**לפרודקשן:** Frontend ב-Vercel, Backend ב-Railway - כל אחד עושה מה שהוא הכי טוב בו

---

## צעדים מהירים

1. ✅ הירשם ל-Railway
2. ✅ צור Project חדש
3. ✅ Deploy Backend (תיקיית `backend/`)
4. ✅ Deploy Frontend (שורש הפרויקט)
5. ✅ הגדר משתני סביבה
6. ✅ עדכן CORS
7. ✅ בדוק שהכל עובד!

---

## פתרון בעיות

### Backend לא רץ?
- בדוק את ה-logs ב-Railway
- ודא ש-`requirements.txt` מעודכן
- ודא שמשתני הסביבה מוגדרים

### Frontend לא מתחבר ל-Backend?
- בדוק ש-`NEXT_PUBLIC_API_URL` נכון
- בדוק ש-CORS מוגדר נכון
- בדוק שה-Backend רץ (לחץ על ה-URL ישירות)

### Build נכשל?
- בדוק את ה-logs
- ודא ש-`package.json` מעודכן
- ודא ש-`node_modules` לא ב-`.gitignore` (אבל זה לא צריך להיות שם)

---

## סיכום

**כן, אפשר להעלות הכל ב-Railway!** 🚀

זה יעבוד מצוין, אבל Vercel עדיין טוב יותר ל-Next.js מבחינת ביצועים ו-CDN.

**המלצה:** התחל עם הכל ב-Railway, ואם צריך ביצועים טובים יותר ל-Frontend, תעבור ל-Vercel.

