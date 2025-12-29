from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from app import schemas
from app.api import deps
from app.services.firestore_service import firestore_service

router = APIRouter()

@router.get("/", response_model=List[schemas.Mood])
async def read_moods(
    current_user: dict = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve mood entries for current user.
    """
    entries = await firestore_service.get_mood_entries(
        user_id=current_user['id'],
        skip=skip,
        limit=limit
    )
    return entries

@router.post("/", response_model=schemas.Mood)
async def create_mood(
    *,
    mood_in: schemas.MoodCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Create new mood entry.
    """
    mood_data = mood_in.model_dump()
    mood_id = await firestore_service.create_mood_entry(
        user_id=current_user['id'],
        data=mood_data
    )
    # Return the created entry
    entries = await firestore_service.get_mood_entries(
        user_id=current_user['id'],
        skip=0,
        limit=1
    )
    if entries:
        return entries[0]
    raise HTTPException(status_code=500, detail="Failed to create mood entry")

@router.delete("/", response_model=dict)
async def delete_all_moods(
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Delete all mood entries for current user. (Used by 'Clean History' button)
    """
    count = await firestore_service.delete_all_mood_entries(
        user_id=current_user['id']
    )
    return {"msg": f"Deleted {count} mood entries"}
