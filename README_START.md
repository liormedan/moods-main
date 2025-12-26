# הפעלת הפרויקט

## 🚀 הפעלה מהירה

### Windows PowerShell (מומלץ)
```powershell
.\start.ps1
```

### Windows CMD
```cmd
start.bat
```

זה יפתח 2 חלונות:
- **Backend** - רץ על `http://localhost:8000`
- **Frontend** - רץ על `http://localhost:3000`

---

## 🛑 עצירת הפרויקט

### Windows PowerShell
```powershell
.\stop.ps1
```

### Windows CMD
```cmd
stop.bat
```

או פשוט סגור את החלונות שנפתחו.

---

## 📋 מה ה-Script עושה?

1. **בודק שהכל מוכן:**
   - Backend venv קיים
   - Frontend node_modules קיים
   - .env קיים (אם לא - מציג אזהרה)

2. **מתקין dependencies (אם צריך):**
   - Frontend: `npm install`

3. **מריץ את ה-Backend:**
   - פותח חלון PowerShell חדש
   - מפעיל את ה-venv
   - מריץ `uvicorn backend.app.main:app --reload --port 8000`

4. **מריץ את ה-Frontend:**
   - פותח חלון PowerShell חדש
   - מריץ `npm run dev`

---

## 🔧 הפעלה ידנית

אם תרצה להריץ ידנית:

### Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn backend.app.main:app --reload --port 8000
```

### Frontend
```powershell
npm run dev
```

---

## ✅ בדיקה שהכל עובד

1. **Backend:** פתח `http://localhost:8000/health`
   - צריך לראות: `{"status":"ok","app":"Moods Enter API"}`

2. **Backend Docs:** פתח `http://localhost:8000/docs`
   - צריך לראות: Swagger UI

3. **Frontend:** פתח `http://localhost:3000`
   - צריך לראות: דף התחברות או dashboard

---

## 🐛 פתרון בעיות

### "Backend venv not found"
```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### "Port 8000 already in use"
```powershell
# מצא מה משתמש ב-port
netstat -ano | findstr :8000

# או שנה את ה-port ב-start.ps1
```

### "Port 3000 already in use"
```powershell
# מצא מה משתמש ב-port
netstat -ano | findstr :3000

# או שנה את ה-port ב-start.ps1
```

### Script לא רץ?
```powershell
# אפשר הרצת scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📝 הערות

- ה-Script יוצר קבצים זמניים ב-`%TEMP%` (נמחקים אוטומטית)
- החלונות נשארים פתוחים כדי לראות logs
- סגירת החלונות תעצור את ה-servers

---

**הכל מוכן! הרץ `.\start.ps1` והכל יעבוד!** 🎉

