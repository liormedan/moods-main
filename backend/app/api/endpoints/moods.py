from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app import models, schemas
from backend.app.api import deps
from backend.app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Mood])
async def read_moods(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve mood entries for current user.
    """
    stmt = select(models.MoodEntry).where(models.MoodEntry.user_id == current_user.id).offset(skip).limit(limit).order_by(models.MoodEntry.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=schemas.Mood)
async def create_mood(
    *,
    db: AsyncSession = Depends(get_db),
    mood_in: schemas.MoodCreate,
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    """
    Create new mood entry.
    """
    mood = models.MoodEntry(
        **mood_in.model_dump(),
        user_id=current_user.id
    )
    db.add(mood)
    await db.commit()
    await db.refresh(mood)
    return mood

@router.delete("/", response_model=dict)
async def delete_all_moods(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    """
    Delete all mood entries for current user. (Used by 'Clean History' button)
    """
    # Delete based on user_id
    stmt = select(models.MoodEntry).where(models.MoodEntry.user_id == current_user.id)
    result = await db.execute(stmt)
    entries = result.scalars().all()
    
    for entry in entries:
        await db.delete(entry)
        
    await db.commit()
    return {"msg": "All mood entries deleted"}
