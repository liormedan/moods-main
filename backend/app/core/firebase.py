import firebase_admin
from firebase_admin import credentials, auth, firestore
from app.core.config import settings
import os

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Option 1: Use service account JSON file
    if settings.FIREBASE_SERVICE_ACCOUNT_PATH:
        # Get absolute path relative to backend directory
        service_account_path = settings.FIREBASE_SERVICE_ACCOUNT_PATH
        if not os.path.isabs(service_account_path):
            # Relative path - resolve from backend directory (where .env file is)
            # Get the backend directory by going up from this file's location
            # This file is in backend/app/core/, so we need to go up 2 levels to get to backend/
            current_file_dir = os.path.dirname(os.path.abspath(__file__))
            # backend/app/core -> backend/app -> backend
            backend_dir = os.path.dirname(os.path.dirname(current_file_dir))
            # The service account file is in the backend directory
            # Remove ./ prefix if present and join with backend_dir
            file_name = service_account_path.lstrip('./')
            service_account_path = os.path.join(backend_dir, file_name)
        
        # Debug: verify path before checking
        import sys
        if not os.path.exists(service_account_path):
            print(f"ERROR: Firebase service account file not found!", file=sys.stderr)
            print(f"Looking for: {service_account_path}", file=sys.stderr)
            print(f"Current working directory: {os.getcwd()}", file=sys.stderr)
            print(f"Backend directory: {backend_dir}", file=sys.stderr)
            print(f"Current file dir: {os.path.dirname(os.path.abspath(__file__))}", file=sys.stderr)
            raise FileNotFoundError(f"Firebase service account file not found: {service_account_path}")
        
        # File exists, initialize Firebase
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    # Option 2: Use environment variable with JSON content
    elif settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        import json
        cred = credentials.Certificate(json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON))
        firebase_admin.initialize_app(cred)
    # Option 3: Use default credentials (for production/GCP)
    else:
        firebase_admin.initialize_app()

# Get Firestore client
db = firestore.client()

# Export Firebase services
__all__ = ['auth', 'db']

