from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from app import schemas
from app.api import deps
from app.services.firestore_service import firestore_service

router = APIRouter()

@router.get("/", response_model=List[schemas.Appointment])
async def read_appointments(
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Get all appointments for current user
    """
    appointments = await firestore_service.get_appointments(current_user['id'])
    return appointments

@router.post("/", response_model=schemas.Appointment)
async def create_appointment(
    *,
    appointment_in: schemas.AppointmentCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Create a new appointment
    """
    appointment_data = appointment_in.model_dump()
    appointment_id = await firestore_service.create_appointment(
        current_user['id'],
        appointment_data
    )
    # Return the created appointment
    appointments = await firestore_service.get_appointments(current_user['id'])
    created_appointment = next((a for a in appointments if a['id'] == appointment_id), None)
    if created_appointment:
        return created_appointment
    raise HTTPException(status_code=500, detail="Failed to create appointment")
