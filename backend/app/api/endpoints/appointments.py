from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app import models, schemas
from backend.app.api import deps
from backend.app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Appointment])
async def read_appointments(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    stmt = select(models.Appointment).where(models.Appointment.user_id == current_user.id).order_by(models.Appointment.date)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=schemas.Appointment)
async def create_appointment(
    *,
    db: AsyncSession = Depends(get_db),
    appointment_in: schemas.AppointmentCreate,
    current_user: models.User = Depends(deps.get_current_user)
) -> Any:
    item = models.Appointment(**appointment_in.model_dump(), user_id=current_user.id)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item
