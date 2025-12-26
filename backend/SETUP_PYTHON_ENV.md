# 🐍 הגדרת סביבת Python - Backend

מדריך מפורט ליצירת והגדרת סביבת Python עבור ה-backend.

---

## שלב 1: בדיקת התקנת Python

### Windows
```powershell
python --version
```
או
```powershell
py --version
```

**אם Python לא מותקן:**
1. הורד מ-[python.org](https://www.python.org/downloads/)
2. ודא שסימנת "Add Python to PATH" בהתקנה
3. הפעל מחדש את הטרמינל

---

## שלב 2: יצירת Virtual Environment

### Windows PowerShell
```powershell
# נווט לתיקיית backend
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"

# צור virtual environment
py -m venv venv
```
או
```powershell
python -m venv venv
```

**הערה:** השתמש ב-`py` אם `python` לא עובד.

### Windows CMD
```cmd
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"
python -m venv venv
```

### Linux/Mac
```bash
cd moods-enter/backend
python3 -m venv venv
```

**בדיקה:**
- [ ] תיקיית `venv/` נוצרה בתיקיית `backend/`

---

## שלב 3: הפעלת Virtual Environment

### Windows PowerShell
```powershell
.\venv\Scripts\Activate.ps1
```

**אם יש שגיאת Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

### Windows CMD
```cmd
venv\Scripts\activate.bat
```

### Linux/Mac
```bash
source venv/bin/activate
```

**סימן שהפעלה הצליחה:**
- תראה `(venv)` בתחילת שורת הפקודה

**דוגמה:**
```
(venv) PS C:\Lior Main\MyEnter\moods-enter\moods-enter\backend>
```

---

## שלב 4: עדכון requirements.txt

לפני התקנת ה-dependencies, צריך לעדכן את `requirements.txt` ל-Firebase:

**פתח את `backend/requirements.txt` ועדכן ל:**

```txt
fastapi==0.109.2
uvicorn[standard]==0.27.1
firebase-admin==6.5.0
pydantic==2.6.1
pydantic-settings==2.2.1
python-multipart==0.0.9
email-validator==2.1.0.post1
```

**הסר את השורות הבאות (אם קיימות):**
- `sqlalchemy==2.0.27`
- `alembic==1.13.1`
- `asyncpg==0.29.0`
- `python-jose[cryptography]==3.3.0`
- `passlib[bcrypt]==1.7.4`

---

## שלב 5: התקנת Dependencies

**ודא ש-venv פעיל** (תראה `(venv)` בשורת הפקודה)

```powershell
# עדכן pip תחילה
py -m pip install --upgrade pip

# התקן את כל ה-dependencies
py -m pip install -r requirements.txt
```

**או אם `python` עובד:**
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**בדיקה:**
- [ ] כל ה-packages מותקנים
- [ ] אין שגיאות התקנה

---

## שלב 6: בדיקת ההתקנה

```powershell
# בדוק שהכל מותקן
pip list

# בדוק FastAPI
python -c "import fastapi; print('FastAPI OK')"

# בדוק Firebase Admin
python -c "import firebase_admin; print('Firebase Admin OK')"
```

**בדיקה:**
- [ ] כל ה-packages מופיעים ב-`pip list`
- [ ] אין שגיאות import

---

## שלב 7: יצירת קובץ .env

**צור קובץ `backend/.env`:**

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account-key.json
FIREBASE_PROJECT_ID=your-project-id

# API
PROJECT_NAME=Moods Enter API
API_V1_STR=/api/v1

# Security (optional)
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520
```

**הערה:** תצטרך ליצור Service Account Key מ-Firebase Console (ראה `FIREBASE_PYTHON_MIGRATION.md`)

---

## שלב 8: בדיקת הרצת Backend

```powershell
# ודא שאתה בתיקיית backend
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"

# ודא ש-venv פעיל
.\venv\Scripts\Activate.ps1

# הרץ את ה-backend
uvicorn backend.app.main:app --reload --port 8000
```

**בדיקה:**
- [ ] Backend רץ על `http://localhost:8000`
- [ ] אין שגיאות
- [ ] בדיקת `/health` מחזירה `{"status": "ok"}`

---

## 🎯 סיכום

לאחר השלמת כל השלבים:

1. ✅ Virtual environment נוצר ופעיל
2. ✅ כל ה-dependencies מותקנים
3. ✅ קובץ `.env` מוגדר
4. ✅ Backend רץ

---

## 💡 טיפים

### הפעלת venv בכל פעם
כשאתה פותח טרמינל חדש, תצטרך להפעיל את ה-venv שוב:
```powershell
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"
.\venv\Scripts\Activate.ps1
```

### יצירת alias (אופציונלי)
אפשר ליצור alias ב-PowerShell:
```powershell
# הוסף ל-PowerShell profile
notepad $PROFILE

# הוסף את השורה הבאה:
function ActivateBackend { cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"; .\venv\Scripts\Activate.ps1 }

# אחר כך תוכל פשוט להריץ:
ActivateBackend
```

### Deactivate venv
כשאתה רוצה לצאת מה-venv:
```powershell
deactivate
```

---

**בהצלחה! 🚀**

