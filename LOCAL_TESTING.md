# בדיקה מקומית - לפני פריסה

## ✅ Checklist - מה לבדוק מקומית

### 1. בדיקת Backend

#### 1.1 הפעלת Backend

```powershell
# עבור לתיקיית backend
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"

# הפעל את ה-venv
.\venv\Scripts\Activate.ps1

# הרץ את ה-backend
uvicorn backend.app.main:app --reload --port 8000
```

**צריך לראות:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### 1.2 בדיקת Health Endpoint

פתח דפדפן או הרץ ב-PowerShell חדש:

```powershell
# בדוק את ה-health endpoint
curl http://localhost:8000/health

# או עם Invoke-WebRequest:
Invoke-WebRequest -Uri http://localhost:8000/health | Select-Object -ExpandProperty Content
```

**צריך לראות:**
```json
{"status":"ok","app":"Moods Enter API"}
```

#### 1.3 בדיקת API Documentation

פתח בדפדפן:
```
http://localhost:8000/docs
```

**צריך לראות:** Swagger UI עם כל ה-endpoints

#### 1.4 בדיקת Firebase Connection

ב-PowerShell חדש (כשה-backend רץ):

```powershell
# בדוק שה-Firebase מחובר
curl http://localhost:8000/api/v1/auth/login/access-token
```

**צריך לראות:** שגיאה 422 (Validation Error) - זה בסדר, זה אומר שה-API עובד!

---

### 2. בדיקת Frontend

#### 2.1 הפעלת Frontend

```powershell
# עבור לתיקיית הפרויקט
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter"

# ודא ש-npm packages מותקנים
npm install

# הרץ את ה-frontend
npm run dev
```

**צריך לראות:**
```
  ▲ Next.js 15.5.9
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

#### 2.2 בדיקת Frontend בדפדפן

פתח בדפדפן:
```
http://localhost:3000
```

**צריך לראות:**
- דף התחברות או דף הבית (תלוי אם יש token)

#### 2.3 בדיקת חיבור Frontend ל-Backend

1. פתח את ה-Developer Tools (F12)
2. לך ל-Tab "Network"
3. נסה להתחבר או לבצע פעולה
4. בדוק שה-requests יוצאים ל-`http://localhost:8000/api/v1/...`

---

### 3. בדיקה End-to-End

#### 3.1 בדיקת Signup

1. פתח `http://localhost:3000/signup`
2. מלא פרטים:
   - Email: `test@example.com`
   - Password: `test123456`
3. לחץ "הרשמה"

**צריך לראות:**
- הודעת הצלחה או redirect ל-dashboard
- אין שגיאות ב-console

#### 3.2 בדיקת Login

1. פתח `http://localhost:3000/login`
2. מלא פרטים:
   - Email: `test@example.com`
   - Password: `test123456`
3. לחץ "התחברות"

**צריך לראות:**
- Redirect ל-dashboard
- Token נשמר ב-cookies/localStorage
- אין שגיאות ב-console

#### 3.3 בדיקת יצירת Mood Entry

1. אחרי התחברות, לך ל-dashboard
2. לחץ על "הוסף מצב רוח" או כפתור דומה
3. מלא פרטים:
   - מצב רוח: 5
   - אנרגיה: 4
   - לחץ: 3
   - הערה: "זהו בדיקה"
4. לחץ "שמור"

**צריך לראות:**
- הודעת הצלחה
- ה-mood entry מופיע ב-dashboard
- אין שגיאות ב-console

#### 3.4 בדיקת קריאת Mood Entries

1. בדף ה-dashboard
2. בדוק שה-mood entries מופיעים

**צריך לראות:**
- רשימת mood entries
- אין שגיאות ב-console

---

### 4. בדיקת Firebase

#### 4.1 בדיקת Firestore

1. היכנס ל-[Firebase Console](https://console.firebase.google.com)
2. בחר את הפרויקט `moods-firebase-1a211`
3. לך ל-Firestore Database
4. בדוק שיש collections:
   - `mood_entries`
   - `user_settings`
   - `emergency_contacts`
   - וכו'

#### 4.2 בדיקת Authentication

1. ב-Firebase Console, לך ל-Authentication
2. בדוק שיש משתמשים שנוצרו

---

## 🔧 פתרון בעיות

### Backend לא רץ?

**שגיאה: `ModuleNotFoundError: No module named 'backend'`**
```powershell
# ודא שאתה רץ מהשורש של הפרויקט, לא מתוך backend/
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter"
uvicorn backend.app.main:app --reload --port 8000
```

**שגיאה: `Firebase service account file not found`**
- ודא ש-`.env` קיים ב-`backend/.env`
- ודא ש-`FIREBASE_SERVICE_ACCOUNT_PATH` מצביע לקובץ הנכון
- ודא שקובץ ה-JSON קיים

**שגיאה: `Port 8000 already in use`**
```powershell
# מצא מה משתמש ב-port 8000
netstat -ano | findstr :8000

# או שנה את ה-port:
uvicorn backend.app.main:app --reload --port 8001
```

### Frontend לא רץ?

**שגיאה: `Port 3000 already in use`**
```powershell
# מצא מה משתמש ב-port 3000
netstat -ano | findstr :3000

# או שנה את ה-port:
npm run dev -- -p 3001
```

**שגיאה: `Cannot find module`**
```powershell
# מחק node_modules והתקן מחדש
Remove-Item -Recurse -Force node_modules
npm install
```

### Frontend לא מתחבר ל-Backend?

**בדוק:**
1. שה-backend רץ על `http://localhost:8000`
2. ש-`NEXT_PUBLIC_API_URL` מוגדר ב-`.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
3. שאין שגיאות CORS ב-console

**אם יש שגיאות CORS:**
- ודא שה-backend רץ
- בדוק את `backend/app/main.py` - ש-CORS מוגדר נכון

### Authentication לא עובד?

**שגיאה: "Not authenticated"**
- בדוק שה-token נשמר ב-cookies/localStorage
- בדוק שה-backend מקבל את ה-token
- בדוק את ה-logs של ה-backend

**שגיאה: "verify_id_token() expects an ID token, but was given a custom token"**
- זה אומר שה-backend מקבל custom token
- זה אמור לעבוד עם הקוד הנוכחי ב-`deps.py`
- אם לא, בדוק שה-backend רץ עם הקוד המעודכן

---

## ✅ סיכום - מה צריך לעבוד

- [ ] Backend רץ על `http://localhost:8000`
- [ ] Health endpoint מחזיר `{"status":"ok"}`
- [ ] API docs זמינים ב-`http://localhost:8000/docs`
- [ ] Frontend רץ על `http://localhost:3000`
- [ ] Signup עובד
- [ ] Login עובד
- [ ] יצירת mood entry עובד
- [ ] קריאת mood entries עובד
- [ ] Firebase מחובר (בודק ב-Console)
- [ ] אין שגיאות ב-console

**אם הכל עובד - אפשר לפרוס ל-Google Cloud!** 🚀

---

## 🚀 אחרי שהכל עובד מקומית

1. ודא שהכל עובד (לפי ה-checklist למעלה)
2. המשך ל-`GOOGLE_CLOUD_QUICK_START.md` לפריסה
3. או ל-`RAILWAY_DEPLOYMENT.md` אם תרצה Railway

