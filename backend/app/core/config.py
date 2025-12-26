from pydantic_settings import BaseSettings
from typing import Optional
import os
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Moods Enter API"
    API_V1_STR: str = "/api/v1"
    
    # Database (temporary - will use Firebase Firestore later)
    DATABASE_URL: Optional[str] = "sqlite:///./temp.db"
    
    # Firebase Configuration (will be configured later)
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_JSON: Optional[str] = None
    FIREBASE_PROJECT_ID: Optional[str] = None
    
    # Security (temporary - will use Firebase Auth later)
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_CHANGE_ME"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    class Config:
        # Find .env file in backend directory
        # This file is in backend/app/core/, so go up 2 levels to find backend/.env
        current_file_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(os.path.dirname(current_file_dir))
        env_file = os.path.join(backend_dir, ".env")
        case_sensitive = True

settings = Settings()

# If running on Google Cloud Run, try to load from Secret Manager
if os.getenv("K_SERVICE"):  # Cloud Run sets this environment variable
    try:
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        if project_id:
            secret_name = f"projects/{project_id}/secrets/firebase-service-account/versions/latest"
            response = client.access_secret_version(request={"name": secret_name})
            settings.FIREBASE_SERVICE_ACCOUNT_JSON = response.payload.data.decode("UTF-8")
            print("Loaded Firebase credentials from Secret Manager")
    except ImportError:
        print("google-cloud-secret-manager not installed, skipping Secret Manager")
    except Exception as e:
        print(f"Could not load secret from Secret Manager: {e}")
        print("Falling back to environment variables")
