# פריסה ב-Google Cloud Platform (GCP)

## סקירה כללית

Google Cloud מציע מספר שירותים לפריסת הפרויקט שלך:

### Backend (FastAPI):
- **Cloud Run** ⭐ (מומלץ) - Serverless containers
- **App Engine** - Managed platform
- **Compute Engine** - VMs (יותר מורכב)

### Frontend (Next.js):
- **Cloud Run** - אפשרי אבל לא מומלץ
- **Firebase Hosting** - לא תומך ב-Next.js
- **Vercel** - עדיין הכי טוב ל-Next.js (מומלץ להשאיר)

---

## 🚀 אפשרות 1: Cloud Run (מומלץ ל-Backend)

### יתרונות:
- ✅ Serverless (שלם רק לפי שימוש)
- ✅ Auto-scaling אוטומטי
- ✅ תמיכה מצוינת ב-Python/FastAPI
- ✅ חינמי עד גבול מסוים
- ✅ תמיכה ב-containers

### חסרונות:
- ❌ דורש יצירת Dockerfile
- ❌ הגדרה קצת יותר מורכבת
- ❌ דורש הבנה בסיסית של GCP

---

## 📋 צעדים לפריסה ב-Cloud Run

### שלב 1: הכנת הפרויקט

#### 1.1 יצירת Dockerfile

צור קובץ `backend/Dockerfile`:

```dockerfile
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Cloud Run uses PORT environment variable)
ENV PORT=8080
EXPOSE 8080

# Run the application
CMD exec uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

#### 1.2 יצירת .dockerignore

צור קובץ `backend/.dockerignore`:

```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
venv/
env/
.venv
.env
*.db
*.sqlite
.git
.gitignore
README.md
*.md
.pytest_cache
.coverage
htmlcov/
```

#### 1.3 עדכון main.py (אם צריך)

ודא ש-`backend/app/main.py` יכול לקבל PORT מ-environment variable:

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS - עדכן עם ה-URL של ה-Frontend
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    os.getenv("FRONTEND_URL", "*"),  # הוסף משתנה סביבה
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}

from backend.app.api.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)
```

---

### שלב 2: הגדרת Google Cloud

#### 2.1 התקנת Google Cloud SDK

**Windows:**
1. הורד מ-[cloud.google.com/sdk](https://cloud.google.com/sdk)
2. התקן את ה-SDK
3. פתח PowerShell והרץ:
   ```powershell
   gcloud init
   ```

**או עם Chocolatey:**
```powershell
choco install gcloudsdk
```

#### 2.2 יצירת Project ב-GCP

1. היכנס ל-[console.cloud.google.com](https://console.cloud.google.com)
2. לחץ על "Select a project" > "New Project"
3. שם: `moods-enter` (או שם אחר)
4. לחץ "Create"

#### 2.3 הגדרת Authentication

```powershell
# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

### שלב 3: בניית והעלאת Image

#### 3.1 בניית Docker Image

```powershell
cd "C:\Lior Main\MyEnter\moods-enter\moods-enter\backend"

# Build image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/moods-backend

# או עם Docker (אם מותקן):
docker build -t gcr.io/YOUR_PROJECT_ID/moods-backend .
docker push gcr.io/YOUR_PROJECT_ID/moods-backend
```

#### 3.2 פריסה ל-Cloud Run

```powershell
gcloud run deploy moods-backend \
  --image gcr.io/YOUR_PROJECT_ID/moods-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

**הערה:** `--allow-unauthenticated` מאפשר גישה ללא authentication. אם תרצה authentication, הסר את זה.

---

### שלב 4: הגדרת משתני סביבה

#### 4.1 דרך Console:

1. היכנס ל-[Cloud Run Console](https://console.cloud.google.com/run)
2. לחץ על ה-service שלך
3. לחץ "Edit & Deploy New Revision"
4. תחת "Variables & Secrets", הוסף:

```
FIREBASE_SERVICE_ACCOUNT_JSON=<הדבק את כל ה-JSON כאן>
FIREBASE_PROJECT_ID=moods-firebase-1a211
SECRET_KEY=<מפתח סודי חזק>
PROJECT_NAME=Moods Enter API
API_V1_STR=/api/v1
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### 4.2 דרך CLI:

```powershell
gcloud run services update moods-backend \
  --set-env-vars="FIREBASE_PROJECT_ID=moods-firebase-1a211,SECRET_KEY=your-secret-key" \
  --region us-central1
```

**הערה:** עבור `FIREBASE_SERVICE_ACCOUNT_JSON`, עדיף להשתמש ב-Secret Manager (ראה למטה).

---

### שלב 5: שימוש ב-Secret Manager (מומלץ)

#### 5.1 יצירת Secret

```powershell
# צור secret עבור Firebase credentials
echo '{"type":"service_account",...}' | gcloud secrets create firebase-service-account \
  --data-file=- \
  --replication-policy="automatic"
```

#### 5.2 הרשאות ל-Cloud Run

```powershell
# תן ל-Cloud Run גישה ל-secret
gcloud secrets add-iam-policy-binding firebase-service-account \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### 5.3 שימוש ב-Secret ב-Cloud Run

```powershell
gcloud run services update moods-backend \
  --update-secrets="FIREBASE_SERVICE_ACCOUNT_JSON=firebase-service-account:latest" \
  --region us-central1
```

---

## 🔧 עדכון קוד ל-Cloud Run

### עדכון config.py לקרוא מ-Secret Manager

```python
from pydantic_settings import BaseSettings
from typing import Optional
import os
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Moods Enter API"
    API_V1_STR: str = "/api/v1"
    
    # Firebase Configuration
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_JSON: Optional[str] = None
    FIREBASE_PROJECT_ID: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_CHANGE_ME"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# אם ב-Cloud Run, נסה לקרוא מ-Secret Manager
if os.getenv("K_SERVICE"):  # Cloud Run sets this
    try:
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        secret_name = f"projects/{project_id}/secrets/firebase-service-account/versions/latest"
        response = client.access_secret_version(request={"name": secret_name})
        settings.FIREBASE_SERVICE_ACCOUNT_JSON = response.payload.data.decode("UTF-8")
    except Exception as e:
        print(f"Could not load secret: {e}")
```

---

## 🌐 פריסת Frontend

### אפשרות 1: Vercel (מומלץ) ⭐

**למה:** Vercel עדיין הכי טוב ל-Next.js

1. הירשם ל-[Vercel](https://vercel.com)
2. חבר את ה-GitHub repository
3. הגדר משתנה סביבה:
   ```
   NEXT_PUBLIC_API_URL=https://moods-backend-xxxxx-uc.a.run.app/api/v1
   ```
4. Vercel יבנה ויפרס אוטומטית

### אפשרות 2: Cloud Run (אם רוצה הכל ב-GCP)

צריך להמיר את Next.js ל-Docker container:

```dockerfile
# Dockerfile ל-Frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**הערה:** Next.js צריך `output: 'standalone'` ב-`next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... rest of config
}
```

---

## 💰 עלויות

### Cloud Run:
- **חינמי:** עד 2 מיליון requests/חודש
- **אחר כך:** $0.40 לכל מיליון requests
- **Compute:** $0.00002400 per vCPU-second
- **Memory:** $0.00000250 per GiB-second

**דוגמה:**
- 100,000 requests/חודש = חינמי
- 1 מיליון requests/חודש = חינמי
- 5 מיליון requests/חודש = ~$1.20

**הערה:** יש גם Free Tier של $300 לניסיון.

---

## 🔐 אבטחה

### 1. CORS

עדכן את `backend/app/main.py`:

```python
origins = [
    "https://your-frontend.vercel.app",
    "https://your-frontend-domain.com",
]
```

### 2. Authentication (אופציונלי)

אם תרצה להגביל גישה:

```powershell
# הסר --allow-unauthenticated
gcloud run deploy moods-backend \
  --image gcr.io/YOUR_PROJECT_ID/moods-backend \
  --no-allow-unauthenticated
```

אז תצטרך להשתמש ב-Identity Token:

```python
# ב-Frontend
headers = {
    'Authorization': f'Bearer {id_token}'
}
```

---

## 📊 ניטור ולוגים

### צפייה ב-Logs:

```powershell
gcloud run services logs read moods-backend --region us-central1
```

### או דרך Console:
1. היכנס ל-[Cloud Run Console](https://console.cloud.google.com/run)
2. לחץ על ה-service
3. לחץ על "Logs"

---

## 🔄 CI/CD עם Cloud Build

### יצירת cloudbuild.yaml

צור קובץ `backend/cloudbuild.yaml`:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/moods-backend', '.']
  
  # Push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/moods-backend']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'moods-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/moods-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### הגדרת Trigger

```powershell
gcloud builds triggers create github \
  --repo-name=YOUR_REPO \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=backend/cloudbuild.yaml
```

עכשיו כל push ל-`main` יבנה ויפרס אוטומטית!

---

## ✅ Checklist

- [ ] התקנת Google Cloud SDK
- [ ] יצירת Project ב-GCP
- [ ] יצירת Dockerfile
- [ ] בניית Docker image
- [ ] פריסה ל-Cloud Run
- [ ] הגדרת משתני סביבה
- [ ] עדכון CORS
- [ ] עדכון Frontend עם ה-URL החדש
- [ ] בדיקה שהכל עובד

---

## 🆘 פתרון בעיות

### Build נכשל?
- בדוק שה-Dockerfile נכון
- בדוק שה-requirements.txt מעודכן
- בדוק את ה-logs: `gcloud builds log BUILD_ID`

### Service לא רץ?
- בדוק את ה-logs: `gcloud run services logs read moods-backend`
- בדוק שמשתני הסביבה מוגדרים
- בדוק שה-PORT נכון (8080)

### CORS errors?
- ודא שה-FRONTEND_URL נכון
- ודא שה-CORS middleware מוגדר נכון

---

## 📝 סיכום

**Google Cloud Run** הוא בחירה מצוינת ל-Backend:
- ✅ Serverless (שלם לפי שימוש)
- ✅ Auto-scaling
- ✅ תמיכה מצוינת ב-Python
- ✅ חינמי עד גבול מסוים

**Frontend:** עדיין מומלץ ב-Vercel (או Cloud Run אם רוצה הכל ב-GCP)

**צעדים הבאים:**
1. התקן Google Cloud SDK
2. צור Dockerfile
3. בנה והעלה image
4. פרוס ל-Cloud Run
5. עדכן Frontend

**הצלחה!** 🚀

