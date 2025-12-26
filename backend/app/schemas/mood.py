from pydantic import BaseModel, UUID4
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
    id: UUID4
    user_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

class Mood(MoodInDBBase):
    pass
