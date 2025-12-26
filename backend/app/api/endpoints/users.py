from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app import models, schemas
from backend.app.api import deps
from backend.app.database import get_db

router = APIRouter()

# --- Settings ---

@router.get("/me/settings", response_model=schemas.User) # Returning User which includes settings
async def read_user_settings(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    # Ensure settings exist (created on signup, but double check)
    if not current_user.settings:
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
        await db.commit()
        await db.refresh(current_user)
    return current_user

@router.put("/me/settings", response_model=models.User) # TODO: Define separate Settings schema if needed
async def update_user_settings(
    *,
    db: AsyncSession = Depends(get_db),
    # settings_in: schemas.UserSettingsUpdate, # TODO: Create schema
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    # For now, we assume user update handles settings or specific endpoint. 
    # Let's keep it simple and stub or implement properly if schema existed.
    # Since I didn't create independent UserSettings schema in schemas/user.py (it's nested in User), 
    # I'll rely on User update or add specific fields here if needed.
    # Actually, let's implement a quick dictionary update for flexibility or add Schema later.
    pass 
    return current_user

# --- Emergency Contacts ---

@router.get("/me/contacts", response_model=List[schemas.EmergencyContact])
async def read_contacts(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.EmergencyContact).where(models.EmergencyContact.user_id == current_user.id).order_by(models.EmergencyContact.created_at)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/me/contacts", response_model=schemas.EmergencyContact)
async def create_contact(
    *,
    db: AsyncSession = Depends(get_db),
    contact_in: schemas.EmergencyContactCreate,
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    contact = models.EmergencyContact(**contact_in.model_dump(), user_id=current_user.id)
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact

@router.delete("/me/contacts/{contact_id}", response_model=dict)
async def delete_contact(
    contact_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.EmergencyContact).where(models.EmergencyContact.id == contact_id, models.EmergencyContact.user_id == current_user.id)
    result = await db.execute(stmt)
    contact = result.scalars().first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await db.delete(contact)
    await db.commit()
    return {"msg": "Contact deleted"}

# --- Therapist Info ---

@router.get("/me/therapist/info", response_model=schemas.TherapistInfo)
async def read_therapist_info(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.TherapistInfo).where(models.TherapistInfo.user_id == current_user.id)
    result = await db.execute(stmt)
    info = result.scalars().first()
    if not info:
        # Return empty/default if not set
        return models.TherapistInfo(user_id=current_user.id)
    return info

@router.put("/me/therapist/info", response_model=schemas.TherapistInfo)
async def update_therapist_info(
    *,
    db: AsyncSession = Depends(get_db),
    info_in: schemas.TherapistInfoCreate,
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.TherapistInfo).where(models.TherapistInfo.user_id == current_user.id)
    result = await db.execute(stmt)
    info = result.scalars().first()
    
    if not info:
        info = models.TherapistInfo(user_id=current_user.id, **info_in.model_dump())
        db.add(info)
        await db.commit()
        await db.refresh(info)
    else:
        update_data = info_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(info, key, value)
        db.add(info)
        await db.commit()
        await db.refresh(info)
    return info

# --- Therapist Tasks ---

@router.get("/me/therapist/tasks", response_model=List[schemas.TherapistTask])
async def read_therapist_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.TherapistTask).where(models.TherapistTask.user_id == current_user.id).order_by(models.TherapistTask.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/me/therapist/tasks", response_model=schemas.TherapistTask)
async def create_therapist_task(
    *,
    db: AsyncSession = Depends(get_db),
    task_in: schemas.TherapistTaskCreate,
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    task = models.TherapistTask(**task_in.model_dump(), user_id=current_user.id)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.put("/me/therapist/tasks/{task_id}", response_model=schemas.TherapistTask)
async def update_therapist_task(
    task_id: str,
    *,
    db: AsyncSession = Depends(get_db),
    task_in: schemas.TherapistTaskCreate, # Or separate update schema with Optional fields
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.TherapistTask).where(models.TherapistTask.id == task_id, models.TherapistTask.user_id == current_user.id)
    result = await db.execute(stmt)
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task
