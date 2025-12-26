from pydantic_settings import BaseSettings
from typing import Optional
import os

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
