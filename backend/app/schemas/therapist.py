from pydantic import BaseModel, UUID4, EmailStr
from typing import Optional
from datetime import datetime

# --- Emergency Contact ---
class EmergencyContactBase(BaseModel):
    name: str
    phone: str
    relation: Optional[str] = None

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContact(EmergencyContactBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Therapist Info ---
class TherapistInfoBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class TherapistInfoCreate(TherapistInfoBase):
    pass

class TherapistInfo(TherapistInfoBase):
    user_id: UUID4
    updated_at: datetime
    
    class Config:
        from_attributes = True

# --- Therapist Task ---
class TherapistTaskBase(BaseModel):
    title: str
    is_completed: bool = False

class TherapistTaskCreate(TherapistTaskBase):
    pass

class TherapistTask(TherapistTaskBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

# --- Appointment ---
class AppointmentBase(BaseModel):
    title: str
    date: datetime
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: UUID4
    user_id: UUID4

    class Config:
        from_attributes = True
