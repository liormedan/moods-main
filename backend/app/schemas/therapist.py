from pydantic import BaseModel, EmailStr
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
    id: str  # Changed from UUID4 to str for Firestore document ID
    user_id: str  # Changed from UUID4 to str for Firebase UID
    created_at: datetime | str  # Can be datetime or ISO string from Firestore
    
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
    user_id: str  # Changed from UUID4 to str for Firebase UID
    updated_at: datetime | str  # Can be datetime or ISO string from Firestore
    
    class Config:
        from_attributes = True

# --- Therapist Task ---
class TherapistTaskBase(BaseModel):
    title: str
    is_completed: bool = False

class TherapistTaskCreate(TherapistTaskBase):
    pass

class TherapistTask(TherapistTaskBase):
    id: str  # Changed from UUID4 to str for Firestore document ID
    user_id: str  # Changed from UUID4 to str for Firebase UID
    created_at: datetime | str  # Can be datetime or ISO string from Firestore

    class Config:
        from_attributes = True

# --- Appointment ---
class AppointmentBase(BaseModel):
    title: str
    date: datetime | str  # Can be datetime or ISO string from Firestore
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: str  # Changed from UUID4 to str for Firestore document ID
    user_id: str  # Changed from UUID4 to str for Firebase UID
    created_at: Optional[datetime | str] = None  # Can be datetime or ISO string from Firestore

    class Config:
        from_attributes = True
