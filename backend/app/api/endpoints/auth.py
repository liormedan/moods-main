from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app import models, schemas
from backend.app.api import deps
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.database import get_db

router = APIRouter()

@router.post("/login/access-token", response_model=schemas.Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Authenticate
    stmt = select(models.User).where(models.User.email == form_data.username)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/signup", response_model=schemas.User)
async def create_user_signup(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    stmt = select(models.User).where(models.User.email == user_in.email)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
        
    user = models.User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Initialize Settings
    user_settings = models.UserSettings(user_id=user.id)
    db.add(user_settings)
    await db.commit()
    
    return user
