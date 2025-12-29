# משתני סביבה ל-Vercel

## הוסף את המשתנים הבאים ב-Vercel Dashboard

1. לך ל: https://vercel.com/dashboard
2. בחר את הפרויקט: `moods-front`
3. לך ל: **Settings** → **Environment Variables**
4. הוסף את המשתנים הבאים (בחר את כל ה-Environments: Production, Preview, Development)

---

## משתני Firebase (חובה)

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCougah2H5M643dXDIRpKCNixEYvDatnMA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=moods-firebase-1a211.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=moods-firebase-1a211
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=moods-firebase-1a211.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=714782008228
NEXT_PUBLIC_FIREBASE_APP_ID=1:714782008228:web:e4a5b45b30f319b6ec5731
```

---

## משתני API (חובה)

```
NEXT_PUBLIC_API_URL=https://moods-backend-226518914198.us-central1.run.app/api/v1
```

---

## משתנים אופציונליים (אם צריך)

```
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-M2QM5DQJC5
```

---

## הוראות:

1. הוסף כל משתנה בנפרד
2. בחר את כל ה-Environments (Production, Preview, Development)
3. לחץ **Save**
4. **חשוב:** אחרי הוספת המשתנים, לך ל-Deployments ולחץ **Redeploy** על ה-deployment האחרון

---

## בדיקה:

אחרי ה-Redeploy, בדוק:
- פתח את https://moods-front.vercel.app
- פתח DevTools → Console
- בדוק שאין שגיאות Firebase initialization
- נסה להתחבר עם Google Sign-in

