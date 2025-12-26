from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from backend.app import schemas
from backend.app.api import deps
from backend.app.services.firestore_service import firestore_service

router = APIRouter()

# --- Settings ---

@router.get("/me/settings", response_model=Dict[str, Any])
async def read_user_settings(
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Get user settings
    """
    settings = await firestore_service.get_user_settings(current_user['id'])
    return settings

@router.put("/me/settings", response_model=Dict[str, Any])
async def update_user_settings(
    *,
    settings_in: schemas.UserSettingsUpdate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Update user settings
    """
    settings_data = settings_in.model_dump(exclude_unset=True)
    updated_settings = await firestore_service.update_user_settings(
        current_user['id'],
        settings_data
    )
    return updated_settings

# --- Emergency Contacts ---

@router.get("/me/contacts", response_model=List[schemas.EmergencyContact])
async def read_contacts(
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Get all emergency contacts for current user
    """
    contacts = await firestore_service.get_emergency_contacts(current_user['id'])
    return contacts

@router.post("/me/contacts", response_model=schemas.EmergencyContact)
async def create_contact(
    *,
    contact_in: schemas.EmergencyContactCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Create a new emergency contact
    """
    contact_data = contact_in.model_dump()
    contact_id = await firestore_service.create_emergency_contact(
        current_user['id'],
        contact_data
    )
    # Return the created contact
    contacts = await firestore_service.get_emergency_contacts(current_user['id'])
    created_contact = next((c for c in contacts if c['id'] == contact_id), None)
    if created_contact:
        return created_contact
    raise HTTPException(status_code=500, detail="Failed to create contact")

@router.delete("/me/contacts/{contact_id}", response_model=dict)
async def delete_contact(
    contact_id: str,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Delete an emergency contact
    """
    # Verify the contact belongs to the user
    contacts = await firestore_service.get_emergency_contacts(current_user['id'])
    contact = next((c for c in contacts if c['id'] == contact_id), None)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await firestore_service.delete_emergency_contact(contact_id)
    return {"msg": "Contact deleted"}

# --- Therapist Info ---

@router.get("/me/therapist/info", response_model=schemas.TherapistInfo)
async def read_therapist_info(
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Get therapist info for current user
    """
    info = await firestore_service.get_therapist_info(current_user['id'])
    if not info:
        # Return empty/default if not set
        return {
            'user_id': current_user['id'],
            'name': None,
            'email': None,
            'phone': None,
            'updated_at': None
        }
    return info

@router.put("/me/therapist/info", response_model=schemas.TherapistInfo)
async def update_therapist_info(
    *,
    info_in: schemas.TherapistInfoCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Update therapist info
    """
    info_data = info_in.model_dump(exclude_unset=True)
    updated_info = await firestore_service.update_therapist_info(
        current_user['id'],
        info_data
    )
    return updated_info

# --- Therapist Tasks ---

@router.get("/me/therapist/tasks", response_model=List[schemas.TherapistTask])
async def read_therapist_tasks(
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Get all therapist tasks for current user
    """
    tasks = await firestore_service.get_therapist_tasks(current_user['id'])
    return tasks

@router.post("/me/therapist/tasks", response_model=schemas.TherapistTask)
async def create_therapist_task(
    *,
    task_in: schemas.TherapistTaskCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Create a new therapist task
    """
    task_data = task_in.model_dump()
    task_id = await firestore_service.create_therapist_task(
        current_user['id'],
        task_data
    )
    # Return the created task
    tasks = await firestore_service.get_therapist_tasks(current_user['id'])
    created_task = next((t for t in tasks if t['id'] == task_id), None)
    if created_task:
        return created_task
    raise HTTPException(status_code=500, detail="Failed to create task")

@router.put("/me/therapist/tasks/{task_id}", response_model=schemas.TherapistTask)
async def update_therapist_task(
    task_id: str,
    *,
    task_in: schemas.TherapistTaskCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> Any:
    """
    Update a therapist task
    """
    # Verify the task belongs to the user
    tasks = await firestore_service.get_therapist_tasks(current_user['id'])
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task_in.model_dump(exclude_unset=True)
    await firestore_service.update_therapist_task(task_id, task_data)
    
    # Return the updated task
    updated_tasks = await firestore_service.get_therapist_tasks(current_user['id'])
    updated_task = next((t for t in updated_tasks if t['id'] == task_id), None)
    if updated_task:
        return updated_task
    raise HTTPException(status_code=500, detail="Failed to update task")
