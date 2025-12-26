# Google Cloud - Quick Start Guide

## צעדים מהירים לפריסה

### 1. התקנת Google Cloud SDK

**Windows:**

**אפשרות 1: עם Chocolatey (הכי קל)**
```powershell
# ודא ש-Chocolatey מותקן
# אם לא, הרץ: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# התקן Google Cloud SDK
choco install gcloudsdk -y

# סגור ופתח מחדש את PowerShell
```

**אפשרות 2: הורדה ידנית (מומלץ)**
1. הורד את ה-installer מ-[cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. בחר "Windows (64-bit)" או "Windows (32-bit)"
3. הרץ את ה-installer
4. סגור ופתח מחדש את PowerShell

**אפשרות 3: עם PowerShell (ללא Chocolatey)**
```powershell
# הורד את ה-installer
Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile "$env:TEMP\GoogleCloudSDKInstaller.exe"

# הרץ את ה-installer
Start-Process -FilePath "$env:TEMP\GoogleCloudSDKInstaller.exe" -Wait

# סגור ופתח מחדש את PowerShell
```

**בדיקה שההתקנה הצליחה:**
```powershell
# בדוק את הגרסה
gcloud --version

# אמור להציג משהו כמו:
# Google Cloud SDK 450.0.0
# ...
```

**אם `gcloud` לא מזוהה:**
- סגור ופתח מחדש את PowerShell
- או הוסף ידנית ל-PATH: `C:\Users\YOUR_USERNAME\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin`

### 2. Login והגדרת Project

```powershell
# Login
gcloud auth login

# צור Project חדש (או בחר קיים)
gcloud projects create moods-enter --name="Moods Enter"

# הגדר את ה-Project
gcloud config set project moods-enter

# הפעל את ה-APIs הנדרשים
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. בניית Docker Image

```powershell
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"

# בנה את ה-image
gcloud builds submit --tag gcr.io/moods-enter/moods-backend
```

**הערה:** החלף `moods-enter` ב-Project ID שלך.

### 4. פריסה ל-Cloud Run

```powershell
gcloud run deploy moods-backend \
  --image gcr.io/moods-enter/moods-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### 5. הגדרת משתני סביבה

```powershell
# דרך CLI
gcloud run services update moods-backend \
  --set-env-vars="FIREBASE_PROJECT_ID=moods-firebase-1a211,SECRET_KEY=your-secret-key,FRONTEND_URL=https://your-frontend.vercel.app" \
  --region us-central1
```

**או דרך Console:**
1. היכנס ל-[Cloud Run Console](https://console.cloud.google.com/run)
2. לחץ על `moods-backend`
3. לחץ "Edit & Deploy New Revision"
4. תחת "Variables & Secrets", הוסף:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` (הדבק את כל ה-JSON)
   - `FIREBASE_PROJECT_ID=moods-firebase-1a211`
   - `SECRET_KEY=<מפתח סודי>`
   - `FRONTEND_URL=https://your-frontend.vercel.app`

### 6. קבלת ה-URL

```powershell
gcloud run services describe moods-backend --region us-central1 --format 'value(status.url)'
```

**או דרך Console:**
ה-URL יופיע בדף ה-service.

### 7. עדכון Frontend

ב-Vercel (או פלטפורמה אחרת), הוסף משתנה סביבה:
```
NEXT_PUBLIC_API_URL=https://moods-backend-xxxxx-uc.a.run.app/api/v1
```

---

## שימוש ב-Secret Manager (מומלץ)

### יצירת Secret

```powershell
# קרא את קובץ ה-JSON
$jsonContent = Get-Content "moods-firebase-1a211-firebase-adminsdk-fbsvc-fa29248034.json" -Raw

# צור secret
echo $jsonContent | gcloud secrets create firebase-service-account --data-file=-
```

### הרשאות

```powershell
# קבל את ה-Service Account של Cloud Run
$SERVICE_ACCOUNT = gcloud run services describe moods-backend --region us-central1 --format 'value(spec.template.spec.serviceAccountName)'

# תן הרשאות
gcloud secrets add-iam-policy-binding firebase-service-account \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

### שימוש ב-Secret

```powershell
gcloud run services update moods-backend \
  --update-secrets="FIREBASE_SERVICE_ACCOUNT_JSON=firebase-service-account:latest" \
  --region us-central1
```

---

## CI/CD עם Cloud Build

### הגדרת Trigger

```powershell
gcloud builds triggers create github \
  --repo-name=moods-enter \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=backend/cloudbuild.yaml
```

**הערה:** צריך לחבר את ה-GitHub repository קודם.

---

## בדיקה

```powershell
# בדוק שה-service רץ
curl https://moods-backend-xxxxx-uc.a.run.app/health

# צפה ב-logs
gcloud run services logs read moods-backend --region us-central1
```

---

## עלויות

- **חינמי:** עד 2 מיליון requests/חודש
- **אחר כך:** ~$0.40 לכל מיליון requests
- **Free Tier:** $300 לניסיון (3 חודשים)

---

## פתרון בעיות

### Build נכשל?
```powershell
# צפה ב-logs
gcloud builds list --limit=1
gcloud builds log BUILD_ID
```

### Service לא רץ?
```powershell
# צפה ב-logs
gcloud run services logs read moods-backend --region us-central1 --limit=50
```

### CORS errors?
- ודא ש-`FRONTEND_URL` נכון
- ודא שה-CORS middleware מוגדר ב-`main.py`

---

## סיכום

✅ התקן Google Cloud SDK  
✅ צור Project  
✅ בנה Docker image  
✅ פרוס ל-Cloud Run  
✅ הגדר משתני סביבה  
✅ עדכן Frontend  

**הכל מוכן!** 🚀

למידע מפורט יותר, ראה `GOOGLE_CLOUD_DEPLOYMENT.md`.

