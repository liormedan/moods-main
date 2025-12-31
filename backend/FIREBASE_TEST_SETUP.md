# 🔥 הגדרת Firebase לבדיקות

## 📋 שלבים להגדרה

### 1. יצירת קובץ `.env.test`

צור קובץ `.env.test` ב-`backend/` (הקובץ כבר ב-.gitignore ולא יועלה ל-GitHub).

השתמש בתבנית מ-`.env.test.example` או העתק את התוכן מההוראות.

### 2. יצירת Service Account ב-Firebase

1. לך ל-[Firebase Console](https://console.firebase.google.com/)
2. בחר את הפרויקט שלך
3. לך ל-**Project Settings** → **Service Accounts**
4. לחץ על **Generate New Private Key**
5. שמור את הקובץ JSON

### 3. הגדרת Secret ב-GitHub Actions

אם תרצה שה-CI ירוץ עם Firebase אמיתי:

#### שלב 1: הצפן את ה-Service Account JSON ל-base64

**ב-Windows (PowerShell):**
```powershell
$content = Get-Content service-account-test.json -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File -Encoding utf8 service-account-base64.txt
```

**ב-Linux/Mac:**
```bash
cat service-account-test.json | base64 > service-account-base64.txt
```

#### שלב 2: הוסף Secret ב-GitHub

1. לך ל-`moods-main` → **Settings** → **Secrets and variables** → **Actions**
2. לחץ על **New repository secret**
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: הדבק את התוכן המוצפן מ-`service-account-base64.txt`
5. לחץ **Add secret**

### 4. בדיקה מקומית

```bash
cd backend
pip install -r requirements.txt
pytest tests/
```

## ⚠️ הערות חשובות

- **אל תדחוף** את `service-account-test.json` או `.env.test` ל-GitHub!
- הקבצים האלה כבר ב-`.gitignore`
- השתמש ב-`service-account-test.json.example` כתבנית בלבד

## 🔒 אבטחה

- ה-Service Account JSON מכיל מפתחות פרטיים
- לעולם אל תדחוף אותו ל-GitHub
- השתמש ב-GitHub Secrets להגדרת CI/CD
- בדוק את ה-`.gitignore` לפני כל commit

## 📝 קבצים חשובים

- `.env.test` - משתני סביבה לבדיקות (לא נדחף ל-GitHub)
- `service-account-test.json` - Service Account JSON (לא נדחף ל-GitHub)
- `service-account-test.json.example` - תבנית (נדחף ל-GitHub)
- `conftest.py` - טוען את `.env.test` אוטומטית

