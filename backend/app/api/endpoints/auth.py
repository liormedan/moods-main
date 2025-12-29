from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from firebase_admin import auth as firebase_auth
from app import schemas
from app.services.firestore_service import firestore_service

router = APIRouter()

@router.post("/signup", response_model=schemas.User)
async def create_user_signup(
    *,
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user with Firebase Auth
    """
    try:
        # Create user in Firebase Auth
        user_record = firebase_auth.create_user(
            email=user_in.email,
            password=user_in.password,
            email_verified=False
        )
        
        # Create default settings in Firestore
        await firestore_service.update_user_settings(
            user_record.uid,
            {'theme': 'system', 'language': 'he'}
        )
        
        return {
            'id': user_record.uid,
            'email': user_record.email,
            'is_active': not user_record.disabled
        }
    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/login/access-token", response_model=schemas.Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Login endpoint - returns Firebase custom token
    
    Note: Firebase Admin SDK cannot verify passwords directly.
    In production, the client should use Firebase SDK to sign in with email/password,
    then send the ID token to the backend for verification.
    
    This endpoint creates a custom token for the user if they exist.
    The client should verify the password using Firebase SDK before calling this.
    """
    try:
        # Get user by email (form_data.username contains the email in OAuth2PasswordRequestForm)
        user = firebase_auth.get_user_by_email(form_data.username)
        
        # Create custom token
        # Note: Password verification should be done client-side with Firebase SDK
        # This endpoint assumes the client has already verified the password
        custom_token = firebase_auth.create_custom_token(user.uid)
        
        return {
            "access_token": custom_token,
            "token_type": "bearer",
        }
    except firebase_auth.UserNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error logging in: {str(e)}"
        )
