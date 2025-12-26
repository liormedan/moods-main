from pydantic import BaseModel, EmailStr
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDBBase(UserBase):
    id: str  # Changed from UUID4 to str for Firebase UID

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass
