from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime

class MoodBase(BaseModel):
    mood_level: int
    energy_level: int
    stress_level: int
    note: Optional[str] = None
    custom_metrics: Optional[List[Any] | Dict[str, Any]] = None

class MoodCreate(MoodBase):
    pass

class MoodUpdate(MoodBase):
    pass

class MoodInDBBase(MoodBase):
    id: str  # Changed from UUID4 to str for Firestore document ID
    user_id: str  # Changed from UUID4 to str for Firebase UID
    created_at: datetime | str  # Can be datetime or ISO string from Firestore

    class Config:
        from_attributes = True

class Mood(MoodInDBBase):
    pass
